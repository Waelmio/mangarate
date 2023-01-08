import { BaseChapter } from "./Chapter";
import { ChapterMap } from "./ChapterMap";

interface MangaAttributes {
    name: string;
    description: string;
    content_page_url: string;
    last_update: Date
}

export interface BaseManga extends MangaAttributes {
    chapters: BaseChapter[];
}

export interface Manga extends MangaAttributes {
    id: number;
    name: string;
    chapters: ChapterMap;
    description: string;
    content_page_url: string;
    last_update: Date
}