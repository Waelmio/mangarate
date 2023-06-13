import config from 'config';
import { migrate } from "./database/Database";
import { Watcher } from './Watcher.service';
import { Logger } from 'tslog';

const log: Logger = new Logger();

export async function init() {
    if (config.has("database.migrate")) {
        log.info("Checking if Database schema is up to date...");
        await migrate(config.get("database.migrate"));
    }
    else {
        log.debug("No migration needed for Database.");
    }

    const theWatcher = new Watcher();
    if (config.has("watcher.enabled") && config.get("watcher.enabled")) {
        theWatcher.start();
    }
}