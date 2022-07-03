import { Manga } from "../../../../MangaRate.Api/src/Models/Manga";

export interface ExpandedManga extends Manga {
    expanded: boolean;
}