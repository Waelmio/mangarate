import config from 'config';
import { Logger } from 'tslog';
import { IBaseChapter } from '../Models/API/Chapter';
import { IBaseManga, IManga } from '../Models/API/Manga';
import { Manga } from '../Models/Manga';
import { getMangas } from './database/Manga.db.service';
import { TimedCall } from './log/TimedCall';
import { MangaService } from './Manga.service';
import { NotificationService } from './Notification.service';

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

    private async watch(): Promise<void> {
        try {
            log.info("Watcher on the roll...");
            const timedCall = new TimedCall();

            const mangas = await getMangas();
            let manga_amount = 0;

            const mangaUpdatePromises: Promise<IManga>[] = [];

            for (const id in mangas) {
                mangaUpdatePromises.push(
                    this.updateManga(mangas[id])
                );
                manga_amount++;
            }

            const updatedMangas: IManga[] = await Promise.all(mangaUpdatePromises);

            let new_chaps_amount = 0;
            let manga_updated = 0;

            updatedMangas.forEach((upManga) => {
                const new_chaps_count = Object.keys(upManga.chapters).length - Object.keys(mangas[upManga.id].chapters).length;

                new_chaps_amount += new_chaps_count;

                // If new chap or manga infos changed
                if (new_chaps_count > 0 || !Manga.infoEquals(upManga, mangas[upManga.id])) {
                    manga_updated ++;
                }
            });
 
            const timed = timedCall.getTimeSinceLastCall();
            log.info(`Watcher out: ${new_chaps_amount} chapters updated on ${manga_updated}/${manga_amount} mangas in ${timed}s.`);
        }
        catch (ex) {
            log.error("The Watcher encoutered an error !", ex);
        }
    }

    private async updateManga(manga: IManga): Promise<IManga> {
        try {
            return await MangaService.updateMangaFromProvider(manga);
        }
        catch (ex) {
            log.error("The Watcher encoutered an error trying to update manga [" + manga.id + "] !", ex);
            return manga;
        }
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
            log.error("The Watcher Randomizer encoutered an error !");
            throw ex;
        }
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}