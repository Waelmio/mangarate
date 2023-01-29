import { IBaseChapter, IChapter } from "../Models/API/Chapter";


export class ChapterService {
    /**
     * Find new chaps.
     */
    public static getNewerChaps(oldChapters: IChapter[], newChapters: IBaseChapter[]): IBaseChapter[] {
        const ret: IBaseChapter[] = [];

        const numMax = Math.max(...oldChapters.map((chap) => chap.num));

        newChapters.forEach((chap) => {
            if (chap.num > numMax) {
                ret.push(chap);
            }
        });
        return ret;
    }
}