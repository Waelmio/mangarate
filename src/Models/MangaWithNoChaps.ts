// A manga without its chapters
export interface BaseMangaWithNoChaps {
    name: string;
    description: string;
    content_page_url: string;
    last_update: Date
}

export interface MangaWithNoChaps extends BaseMangaWithNoChaps {
    id: number;
}