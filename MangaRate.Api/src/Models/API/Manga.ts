import { IBaseChapter, IChapterMap } from "./Chapter";

export interface IMangaMap {
    [id: string]: IManga;
}

interface IMangaAttributes {
    name: string;
    description: string;
    content_page_url: string;
    cover_image: string;
    last_update: Date
}

export interface IBaseManga extends IMangaAttributes {
    chapters: IBaseChapter[];
}

export interface IManga extends IMangaAttributes {
    id: number;
    chapters: IChapterMap;
}