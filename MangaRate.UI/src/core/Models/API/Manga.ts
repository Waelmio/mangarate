import { BaseChapter, ChapterMap } from "./Chapter";

export interface MangaMap {
    [id: string]: Manga;
}

interface MangaAttributes {
    name: string;
    description: string;
    content_page_url: string;
    cover_image: string;
    last_update: Date
}

export interface BaseManga extends MangaAttributes {
    chapters: BaseChapter[];
}

export interface Manga extends MangaAttributes {
    id: number;
    chapters: ChapterMap;
}