import { BaseChapter } from "./Chapter";
import { ChapterMap } from "./ChapterMap";
import { BaseMangaWithNoChaps } from "./MangaWithNoChaps";

export interface BaseManga extends BaseMangaWithNoChaps {
    chapters: BaseChapter[];
}

export interface Manga extends BaseMangaWithNoChaps {
    id: number;
    chapters: ChapterMap;
}