import { BaseManga } from "../Models/Manga";
import { MangaInfoProvider } from "../Providers/MangaInfoProvider";
import { getMangaInfoProvider } from "../Providers/MangaInfoProvider.factory";
import { addMangaToDB, mangaExistByContentUrl } from "./database/Manga.db.service";
import { Logger } from 'tslog';
import { MangaContentPageExistError } from "../common/Error";

const log = new Logger();

/**
 * 
 * @throws BadUrlException | ProviderNotImplemented | ContentPageNotFoundError | MangaContentPageExistError
 */
export async function registerManga(url: string): Promise<void> {
    const start_time = process.hrtime();
    log.info(`Adding manga at ${url} to the database.`);

    try {
        const mangaInfoProvider: MangaInfoProvider = await getMangaInfoProvider(url);

        if (await mangaExistByContentUrl(mangaInfoProvider.contentPageUrl)) {
            log.warn(`Manga at ${url} already exists.`);
            throw new MangaContentPageExistError(mangaInfoProvider.contentPageUrl);
        }

        const manga = await extractManga(url, mangaInfoProvider);
        
        let stop_time = process.hrtime(start_time);
        let timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
        log.info(`Extracted manga at ${url} in ${timed}s for ${manga.chapters.length} chapters.`);
        
        await addMangaToDB(manga);
        
        stop_time = process.hrtime(start_time);
        timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
        log.info(`Adding manga at ${url} finished in ${timed}s.`);
    }
    catch (ex) {
        const stop_time = process.hrtime(start_time);
        const timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
        log.warn(`Adding manga at ${url} failed in ${timed}s.`);
        throw ex;
    }
}

/**
 * 
 * @throws BadUrlException | ProviderNotImplemented | ContentPageNotFoundError
 */
 export async function extractManga(url: string, mangaInfoProvider?: MangaInfoProvider): Promise<BaseManga> {
    if (typeof mangaInfoProvider === 'undefined') {
        mangaInfoProvider = await getMangaInfoProvider(url);
    }

    const name = mangaInfoProvider.getName();
    const description = mangaInfoProvider.getDescription();
    const chapters = mangaInfoProvider.getAllChapters();

    const manga: BaseManga = {
        name: await name,
        description: await description,
        content_page_url: mangaInfoProvider.contentPageUrl,
        chapters: await chapters,
        last_update: new Date()
    };

    return manga;
}