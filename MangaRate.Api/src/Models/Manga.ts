import { BaseChapter } from "./Chapter";
import { Chapters } from "./Chapters";
import { BaseMangaWithNoChaps } from "./MangaWithNoChaps";

export interface BaseManga extends BaseMangaWithNoChaps {
    chapters: BaseChapter[];
}

export interface Manga extends BaseMangaWithNoChaps {
    id: number;
    chapters: Chapters;
}