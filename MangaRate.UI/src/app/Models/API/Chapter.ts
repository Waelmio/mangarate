export interface BaseChapter {
    num: number;
    url: string;
    release_date: Date;
}

export interface Chapter extends BaseChapter {
    id: number;
}