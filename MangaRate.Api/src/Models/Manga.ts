import { IBaseManga, IManga } from "./API/Manga";

export class Manga {
    public static infoEquals(first: IManga, second: IManga): boolean {
        return first.name == second.name
            && first.description == second.description
            && first.content_page_url == second.content_page_url
            && first.cover_image == second.cover_image;
    }
}