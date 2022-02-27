import 'dotenv/config';
import { migrate } from "./database/Database";
import { Watcher } from './Watcher.service';

export async function init() {
    if (process.env.MIGRATE) {
        await migrate(process.env.MIGRATE);
    }

    const theWatcher = new Watcher();
    theWatcher.start();
}