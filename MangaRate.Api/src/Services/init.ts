import config from 'config';
import { migrate } from "./database/Database";
import { Watcher } from './Watcher.service';

export async function init() {
    if (config.has("database.migrate")) {
        await migrate(config.get("database.migrate"));
    }

    const theWatcher = new Watcher();
    if (config.has("watcher.enabled") && config.get("watcher.enabled")) {
        theWatcher.start();
    }
}