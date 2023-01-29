import { IBaseManga, IManga } from "../Models/API/Manga";
import { MangaInfoProvider } from "../Providers/MangaInfoProvider";
import { MangaInfoProviderFactory } from "../Providers/MangaInfoProvider.factory";
import { addMangaToDB, mangaExistByContentUrl, updateMangaInfo } from "./database/Manga.db.service";
import { Logger } from 'tslog';
import { MangaContentPageExistError } from "../common/Error";
import { ChapterService } from "./Chapter.service";
import { NotificationService } from "./Notification.service";
import { addChaptersToDB } from "./database/Chapter.db.service";

const log = new Logger();

export class MangaService {
    /**
     * 
     * @throws BadUrlException | ProviderNotImplemented | ContentPageNotFoundError | MangaContentPageExistError
     */
    public static async registerManga(url: string): Promise<IManga> {
        const start_time = process.hrtime();
        log.info(`Adding manga at ${url} to the database.`);

        try {
            const mangaInfoProvider: MangaInfoProvider = await MangaInfoProviderFactory.getMangaInfoProvider(url);

            if (await mangaExistByContentUrl(mangaInfoProvider.contentPageUrl)) {
                log.warn(`Manga at ${url} already exists.`);
                throw new MangaContentPageExistError(mangaInfoProvider.contentPageUrl);
            }

            const manga = await this.extractManga(url, mangaInfoProvider);

            let stop_time = process.hrtime(start_time);
            let timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
            log.info(`Extracted manga at ${url} in ${timed}s for ${manga.chapters.length} chapters.`);

            const addedManga = await addMangaToDB(manga);

            stop_time = process.hrtime(start_time);
            timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
            log.info(`Adding manga at ${url} finished in ${timed}s.`);

            return addedManga;
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
    public static async extractManga(url: string, mangaInfoProvider?: MangaInfoProvider): Promise<IBaseManga> {
        if (typeof mangaInfoProvider === 'undefined') {
            mangaInfoProvider = await MangaInfoProviderFactory.getMangaInfoProvider(url);
        }

        const name = mangaInfoProvider.getName();
        const description = mangaInfoProvider.getDescription();
        const chapters = mangaInfoProvider.getAllChapters();
        const cover_image = mangaInfoProvider.getCoverImageUrl();

        const manga: IBaseManga = {
            name: await name,
            description: await description,
            content_page_url: mangaInfoProvider.contentPageUrl,
            cover_image: await cover_image,
            chapters: await chapters,
            last_update: new Date()
        };

        return manga;
    }

    /**
     * Update manga by extracting it's information from the online provider.
     * @param manga
     * @returns The updated manga
     */
    public static async updateMangaFromProvider(manga: IManga): Promise<IManga> {
        const extractedManga = await this.extractManga(manga.content_page_url);

        const newBaseChapters = ChapterService.getNewerChaps(Object.values(manga.chapters), extractedManga.chapters);

        if (newBaseChapters.length !== 0) {
            const newChapters = await addChaptersToDB(manga.id, newBaseChapters);
            await NotificationService.notifyForChapters(manga, newChapters);
        }
        return await updateMangaInfo(extractedManga);
    }
}
