import 'dotenv/config';
import { Logger } from 'tslog';
import { BaseChapter, Chapter } from '../Models/Chapter';
import { BaseManga, Manga } from '../Models/Manga';
import { getMangas } from './database/Manga.db.service';
import { addChapsAndNotificationsToDB } from './database/Notification.db.service';
import { extractManga } from './Manga.service';

const log = new Logger();

export class Watcher {
    private _timer!: NodeJS.Timer;

    public start(): void {
        if (!process.env.WATCHER_INTERVAL) {
            const err = new Error("No watcher interval in configuration !");
            log.fatal(err);
            process.exit(-1);
        }

        let interval = Number(process.env.WATCHER_INTERVAL);

        if (isNaN(interval)) {
            const err = new Error("Bad watcher interval in configuration !");
            log.fatal(err);
            process.exit(-1);
        }

        // Interval randomized at +/- 5%
        // Each 95% of timeout, we execute watchRandomizer which launch the Watcher after 0 to 10% of interval.
        interval = Math.floor(
            interval * 1000 * 60 * 0.95
        );

        this._timer = setInterval(this.watchRandomizer.bind(this), interval);
    }

    public stop(): void {
        clearInterval(this._timer);
    }

    private async watchRandomizer(): Promise<void> {
        try {
            let randomTime = Number(process.env.WATCHER_INTERVAL);
            randomTime = Math.floor(
                randomTime * 1000 * 60 * (Math.random() * 0.1)
            );

            setTimeout(this.watch.bind(this), randomTime);
        }
        catch (ex) {
            log.error("The Watcher Randomizer encoutered an error !", ex);
        }
    }

    /**
     * Add new chapters and their notifications to the database, and refresh last chapter update.
     */
    private async addAndNotifyChapters(manga: Manga, newChapsProm: Promise<BaseChapter[]>): Promise<number> {
        try {
            const newChaps = await newChapsProm;

            if (newChaps.length === 0) {
                return 0;
            }

            await addChapsAndNotificationsToDB(manga.id, newChaps);
            return newChaps.length;
        }
        catch (ex) {
            log.error("Error when trying to add and notify new chapters for manga [" + manga.name + "] of id [" + manga.id + "] for Watcher.", ex);
            return 0;
        }
    }

    /**
     * Find new chaps.
     */
    private async getNewChaps(manga: Manga, extrMangaProm: Promise<BaseManga>): Promise<BaseChapter[]> {
        const ret: BaseChapter[] = [];

        try {
            const extrManga = await extrMangaProm;

            let max_num = -1;

            for (const id in manga.chapters) {
                if (manga.chapters[id].num > max_num) {
                    max_num = manga.chapters[id].num;
                }
            }

            extrManga.chapters.forEach((chap) => {
                if (chap.num > max_num) {
                    ret.push(chap);
                }
            });
        }
        catch (ex) {
            log.error("Error when trying to get new chapters for manga: ", manga, ex);
        }
        return ret;
    }

    private async watch(): Promise<void> {
        try {
            log.info("Watcher on the roll...");
            const start_time = process.hrtime();


            const mangas = await getMangas();
            let manga_amount = 0;

            const notifPromises: Promise<number>[] = [];

            for (const id in mangas) {
                const newChapsProm = this.getNewChaps(mangas[id], extractManga(mangas[id].content_page_url));
                notifPromises.push(
                    this.addAndNotifyChapters(mangas[id], newChapsProm)
                );
                manga_amount++;
            }

            const newChapsAmount: number = (await Promise.all(notifPromises)).reduce((a, b) => a + b, 0);

            const stop_time = process.hrtime(start_time);
            const timed = ((stop_time[0] * 1e9 + stop_time[1]) / 1e9).toFixed(3);
            log.info(`Watcher out: ${newChapsAmount} chapters updated on ${manga_amount} mangas in ${timed}s.`);
        }
        catch (ex) {
            log.error("The Watcher encoutered an error !", ex);
        }
    }
}