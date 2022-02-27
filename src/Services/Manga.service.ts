import { BaseManga } from "../Models/Manga";
import { MangaInfoProvider } from "../Providers/MangaInfoProvider";
import { getMangaInfoProvider } from "../Providers/MangaInfoProvider.factory";
import { addMangaToDB } from "./database/Manga.db.service";

/**
 * 
 * @throws BadUrlException | ProviderNotImplemented | ContentPageNotFoundError | MangaContentPageExistError
 */
export async function registerManga(url: string): Promise<void> {

    const manga = await extractManga(url);
    await addMangaToDB(manga);
}

/**
 * 
 * @throws BadUrlException | ProviderNotImplemented | ContentPageNotFoundError
 */
 export async function extractManga(url: string): Promise<BaseManga> {

    const mangaInfoProvider: MangaInfoProvider = await getMangaInfoProvider(url);
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