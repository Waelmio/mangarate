import { Manga } from "@core/Models/API/Manga";

export class AddFollowedManga {
  static readonly type = '[FollowedMangas] Add a Followed Manga';
  constructor(public manga: Manga) { }
}

export class LoadFollowedMangas {
    static readonly type = '[FollowedMangas] Load All Followed Mangas';
    constructor(public mangas: Manga[]) { }
}