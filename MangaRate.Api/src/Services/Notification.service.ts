import { Logger } from 'tslog';
import { IBaseChapter, IChapter } from "../Models/API/Chapter";
import { IBaseManga, IManga } from "../Models/API/Manga";
import { addChapsAndNotificationsToDB, addNotificationsToDB } from "./database/Notification.db.service";


const log = new Logger();

export class NotificationService {

    /**
     * Add chapters notifications to the database.
     */
    public static async notifyForChapters(manga: IManga, newChaps: IChapter[]): Promise<number> {
        try {
            if (newChaps.length === 0) {
                return 0;
            }

            await addNotificationsToDB(manga.id, newChaps);
            return newChaps.length;
        }
        catch (ex) {
            log.error("Error when trying to add and notify new chapters for manga [" + manga.name + "] of id [" + manga.id + "].", ex);
            return 0;
        }
    }
}
