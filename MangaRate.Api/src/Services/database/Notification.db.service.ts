import { PoolClient, QueryResult } from 'pg';
import { Logger } from 'tslog';
import { ChapterIdNotFoundError, MangaIdNotFoundError } from '../../common/Error';
import { BaseChapter, Chapter } from '../../Models/API/Chapter';
import { MangaMap } from '../../Models/API/MangaMap';
import { addChaptersToDB_ } from './Chapter.db.service';
import { getPool } from './Database';
import { mangaExistById_, refreshMangaLastUpdate_ } from './Manga.db.service';

const log = new Logger();

export async function getNotifications(): Promise<MangaMap> {
    const client = await getPool().connect();
    const ret: MangaMap = {};

    try {
        await client.query('BEGIN');

        const selectMangaText = `
        SELECT * FROM manga
        ;`;

        const queryRes = await client.query(selectMangaText);

        const rows = queryRes.rows;

        rows.forEach((row) => {
            if (ret[row.id] === undefined) {
                ret[row.id] = {
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    content_page_url: row.content_page_url,
                    cover_image: row.cover_image,
                    chapters: {},
                    last_update: row.last_update
                };
            }
        });

        if (Object.keys(ret).length > 0) {
            const selectChapterText = `
            SELECT *, C.id chapter_id FROM manga as M
            JOIN chapter as C
            ON M.id = C.manga_id
            JOIN notification as N
            ON C.id = N.chapter_id
            ORDER BY c.release_date DESC
            ;`;

            const chapterQueryRes = await client.query(selectChapterText);

            const chapterRows = chapterQueryRes.rows;

            chapterRows.forEach((row) => {
                if (row.chapter_id) {
                    ret[row.manga_id].chapters[row.chapter_id] = {
                        id: row.chapter_id,
                        num: row.num,
                        url: row.url,
                        release_date: row.release_date
                    };
                }
            });
        }

        await client.query('COMMIT');
    }
    catch (ex) {
        await client.query('ROLLBACK');
        log.error("Error when trying to insert a manga !", ex);
        throw ex;
    }
    finally {
        client.release();
    }
    return ret;
}

/**
 * 
 * @throws MangaIdNotFoundError, ChapterIdNotFoundError
 */
 export async function addChapsAndNotificationsToDB(manga_id: number, baseChapters: BaseChapter[]): Promise<void> {

    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        if (!(await mangaExistById_(manga_id, client))) {
            throw new MangaIdNotFoundError(manga_id);
        }

        const chapters = await addChaptersToDB_(manga_id, baseChapters, client);

        await addNotificationsToDB_(chapters, client);

        await refreshMangaLastUpdate_(manga_id, client);

        await client.query('COMMIT');
    }
    catch (ex) {
        await client.query('ROLLBACK');
        throw ex;
    }
    finally {
        client.release();
    }
}

/**
 * 
 * @throws MangaIdNotFoundError
 */
 export async function addNotificationsToDB(manga_id: number, chapters: Chapter[]): Promise<void> {

    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        if (!(await mangaExistById_(manga_id, client))) {
            throw new MangaIdNotFoundError(manga_id);
        }

        await addNotificationsToDB_(chapters, client);

        await refreshMangaLastUpdate_(manga_id, client);

        await client.query('COMMIT');
    }
    catch (ex) {
        await client.query('ROLLBACK');
        throw ex;
    }
    finally {
        client.release();
    }
}

export async function addNotificationsToDB_(chapters: Chapter[], sharedClient: PoolClient): Promise<void> {

    const client = sharedClient;

    try {
        const insertNotificationQuery = `
        INSERT INTO notification (chapter_id)
        VALUES ($1)
        ;`;

        const queryPromises: Promise<QueryResult>[] = [];

        chapters.forEach((chap) => {
            const notifValues = [
                chap.id
            ];
            queryPromises.push(client.query(insertNotificationQuery, notifValues));
        });

        await Promise.all(queryPromises);
    }
    catch (ex) {
        log.error("Error when trying to insert notifications for new chapters !", ex, chapters);
        throw ex;
    }
}

/**
 * 
 * @throws MangaIdNotFoundError 
 */
export async function deleteNotificationsForManga(manga_id: number): Promise<void> {
    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        // Checking if manga exist
        const selectMangaText = `
        SELECT id FROM manga
        WHERE id = $1
        ;`;

        const selectMangaValues = [manga_id];

        const queryRes = await client.query(selectMangaText, selectMangaValues);

        const mangaFound = queryRes.rowCount;

        if (mangaFound !== 1) {
            throw new MangaIdNotFoundError(manga_id);
        }

        const deleteQueryText = `
        DELETE FROM notification 
        WHERE chapter_id IN (
            SELECT C.id FROM manga as M
            JOIN chapter as C
            ON M.id = C.manga_id
            JOIN notification as N
            ON C.id = N.chapter_id
            WHERE M.id = $1
        )
        ;`;

        await client.query(deleteQueryText, selectMangaValues);
        await client.query('COMMIT');
    }
    catch (ex) {
        await client.query('ROLLBACK');
        if (!(ex instanceof MangaIdNotFoundError)) {
            log.error("Error when trying to delete notifications for a manga !", ex);
        }
        throw ex;
    }
    finally {
        client.release();
    }
}

/**
 * 
 * @throws ChapterIdNotFoundError 
 */
export async function deleteNotificationsForChapter(chapter_id: number): Promise<void> {
    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        // Checking if chapter exist
        const selectChapterText = `
        SELECT id FROM chapter
        WHERE id = $1
        ;`;

        const selectChapterValues = [chapter_id];

        const queryRes = await client.query(selectChapterText, selectChapterValues);

        const chapterFound = queryRes.rowCount;

        if (chapterFound !== 1) {
            throw new ChapterIdNotFoundError(chapter_id);
        }

        const deleteQueryText = `
        DELETE FROM notification 
        WHERE chapter_id = $1
        ;`;

        await client.query(deleteQueryText, selectChapterValues);
        await client.query('COMMIT');
    }
    catch (ex) {
        await client.query('ROLLBACK');
        if (!(ex instanceof MangaIdNotFoundError)) {
            log.error("Error when trying to delete notifications for a chapter !", ex);
        }
        throw ex;
    }
    finally {
        client.release();
    }
}