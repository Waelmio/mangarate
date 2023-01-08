import config from 'config';
import { Logger } from 'tslog';
import { BaseChapter, Chapter } from '../Models/Chapter';
import { BaseManga, Manga } from '../Models/Manga';
import { getMangas } from './database/Manga.db.service';
import { addChapsAndNotificationsToDB } from './database/Notification.db.service';
import { TimedCall } from './log/TimedCall';
import { extractManga } from './Manga.service';

const log = new Logger();

export class Watcher {
    private _watch = false;
    private _interval!: number;

    public async start(): Promise<void> {
        if (!config.has("watcher.interval")) {
            const err = new Error("No watcher interval in configuration !");
            log.fatal(err);
            process.exit(-1);
        }

        // Interval in config is in minutes
        const configInterval = config.get("watcher.interval") as number;

        if (isNaN(configInterval)) {
            const err = new Error("Bad watcher interval in configuration !");
            log.fatal(err);
            process.exit(-1);
        }

        this._interval = configInterval as number * 1000 * 60;

        this._watch = true;
        await this.watchRandomizer();
    }

    public stop(): void {
        this._watch = false;
    }

    private async watchRandomizer(): Promise<void> {
        try {
            while (this._watch) {
                await this.watch();
                // Interval randomized at +0% to +10%
                const randomTime = Math.floor(
                    this._interval * (1 + Math.random() * 0.1)
                );
                await this.sleep(randomTime);
            }
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
            log.error("Error when trying to get new chapters for manga: ", manga.name, ex);
        }
        return ret;
    }

    private async watch(): Promise<void> {
        try {
            log.info("Watcher on the roll...");
            const timedCall = new TimedCall();

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
 
            const timed = timedCall.getTimeSinceLastCall();
            log.info(`Watcher out: ${newChapsAmount} chapters updated on ${manga_amount} mangas in ${timed}s.`);
        }
        catch (ex) {
            log.error("The Watcher encoutered an error !", ex);
        }
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}