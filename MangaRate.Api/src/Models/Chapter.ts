import { IBaseChapter, IChapter } from "./API/Chapter";

export class Chapter {

    public static equals(first: IChapter, second: IChapter): boolean {
        return first.id == second.id
            && Chapter.baseEquals(first, second);
    }

    public static baseEquals(first: IBaseChapter, second: IBaseChapter): boolean {
        return first.num == second.num
            && first.release_date == second.release_date
            && first.url == second.url;
    }
}