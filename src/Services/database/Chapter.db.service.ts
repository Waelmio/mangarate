import { PoolClient, QueryResult } from "pg";
import { Logger } from "tslog";
import { BaseChapter, Chapter } from "../../Models/Chapter";

const log = new Logger();

export async function chapterExistById_(id: number, sharedClient: PoolClient): Promise<boolean> {

    const client = sharedClient;

    const queryText = `
    SELECT id FROM chapter
    WHERE id = $1
    ;`;

    const values = [id];

    try {
        const queryRes = await client.query(queryText, values);
        if (queryRes.rowCount === 1) {
            return true;
        }
        return false;
    }
    catch (ex) {
        log.error("Error when trying to check if chapter with id [" + id + "] exist.", ex);
        throw ex;
    }
}

export async function addChaptersToDB_(manga_id: number, chapters: BaseChapter[], sharedClient: PoolClient): Promise<Chapter[]> {

    const client = sharedClient;

    try {
        const ret: Chapter[] = [];

        const insertChapterText = `
        INSERT INTO chapter (manga_id, num, url, release_date)
        VALUES ($1, $2, $3, $4) RETURNING id
        ;`;

        const queryPromises: Promise<QueryResult>[] = [];

        chapters.forEach((chap) => {
            const chapterValues = [manga_id, chap.num, chap.url, chap.release_date];

            queryPromises.push(client.query(insertChapterText, chapterValues));
        });

        const chaptersQueries = await Promise.all(queryPromises);

        for (let i = 0; i < chapters.length; i++) {
            const id = chaptersQueries[i].rows[0].id;
            ret.push({
                id: id,
                num: chapters[i].num,
                url: chapters[i].url,
                release_date: chapters[i].release_date
            });
        }

        return ret;
    }
    catch (ex) {
        log.error("Error when trying to add chapters to database !", ex);
        throw ex;
    }
}