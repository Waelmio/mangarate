import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { Logger } from 'tslog';

import { fromStream } from 'file-type';
import axios from 'axios';
// // Necessary as this is ESM module only
// const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

import { IManga } from "../Models/API/Manga";
import { BadUrlException } from "../common/Error";
import { response } from 'express';

const log = new Logger();

export class MangaCoverService {
    static coverFolderPath = path.join(__dirname, '../../public/cover/');
    static coverTempFolderPath = path.join(MangaCoverService.coverFolderPath, "temp/");

    private static isValidMimeType(mimeType: string | undefined): boolean {
        return !!mimeType?.startsWith("image/");
    }

    /**
     * 
     * @throws 
     */
    public static async downloadMangaCover(manga: IManga): Promise<void> {
        const filepath = path.join(MangaCoverService.coverFolderPath, manga.id.toString());
        const tempFilePath = path.join(MangaCoverService.coverTempFolderPath, manga.id.toString() + "_" + Date.now());
        const aborter = new AbortController();
        
        try {
            if (!fs.existsSync(MangaCoverService.coverTempFolderPath)){
                fs.mkdirSync(MangaCoverService.coverTempFolderPath, { recursive: true });
            }

            
            const writer = fs.createWriteStream(tempFilePath);


            const response = await axios({
                url: manga.cover_image,
                method: 'GET',
                responseType: 'stream',
                signal: aborter.signal
            });
            response.data.pipe(writer);
            const fileType = await fromStream(response.data);

            if (!this.isValidMimeType(fileType?.mime)) {
                throw new Error(`Wrong file type ! File type found: [${fileType?.mime}].`);
            }

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Move file from temp directory to new path.
            await fsp.rename(tempFilePath, filepath);
        }
        catch (ex) {
            aborter.abort();
            if (fs.existsSync(tempFilePath)) {
                await fsp.rm(tempFilePath);
            }

            log.error(`Error when trying to download cover image for manga [${manga.id}] (${manga.name}), at [${manga.cover_image}]`, ex);
        }
    }
}