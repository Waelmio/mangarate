export interface IChapterMap {
    [id: string]: IChapter;
}

export interface IBaseChapter {
    num: number;
    url: string;
    release_date: Date;
}

export interface IChapter extends IBaseChapter {
    id: number;
}