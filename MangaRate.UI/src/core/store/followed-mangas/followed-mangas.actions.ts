import { Manga } from "@core/Models/API/Manga";

export class LoadAllFollowedMangas {
    static readonly type = '[FollowedMangas] Load All Followed Mangas';
    constructor(public mangas: Manga[]) { }
}

export class LoadFollowedManga {
    static readonly type = '[FollowedMangas] Load a single Followed Manga';
    constructor(public manga: Manga) { }
}

export class RemoveFollowedManga {
    static readonly type = '[FollowedMangas] Remove a single Followed Manga';
    constructor(public manga: Manga) { }
}