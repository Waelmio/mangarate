import { Logger } from 'tslog';
import { IBaseManga, IManga, IMangaMap } from '../../Models/API/Manga';
import { getPool } from './Database';
import { PoolClient, QueryResult } from 'pg';
import { MangaIdNotFoundError, MangaWithContentPageNotFoundError } from "../../common/Error";
import { MangaContentPageExistError, MangaContentPageNotFoundError } from "../../common/Error";

const log = new Logger();

/**
 * Get all mangas in database with chapters ordered by their number, in descending order.
 */
export async function getMangas(): Promise<IMangaMap> {
    const queryText = `
    SELECT M.id m_id, *, C.id chapter_id FROM manga as M
    LEFT JOIN chapter as C
    ON M.id = C.manga_id
    ORDER BY C.release_date DESC
    ;`;

    const pool = getPool();

    try {
        const rows = (await pool.query(queryText)).rows;

        return rowsToMangaMap(rows);
    }
    catch (ex) {
        log.error("Error when trying to get all mangas !", ex);
        throw ex;
    }
}

/**
 * 
 * @throws MangaIdNotFoundError
 */
export async function getManga(id: number): Promise<IManga> {
    const queryText = `
    SELECT M.id m_id, *, C.id chapter_id FROM manga as M
    LEFT JOIN chapter as c
    ON M.id = c.manga_id
    WHERE M.id = $1
    ORDER BY c.num DESC
    ;`;

    const values = [id];

    const pool = getPool();

    try {
        const queryRes = await pool.query(queryText, values);
        if (queryRes.rowCount === 0) {
            throw new MangaIdNotFoundError(id);
        }
        return Object.values(rowsToMangaMap(queryRes.rows))[0];
    }
    catch (ex) {
        if (!(ex instanceof MangaIdNotFoundError)) {
            log.error("Error when trying to get manga with id [" + id + "] !", ex);
        }
        throw ex;
    }
}

/**
 * 
 * @throws MangaContentPageExistError
 */
export async function addMangaToDB(manga: IBaseManga): Promise<IManga> {

    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        if (await mangaExistByContentUrl_(manga.content_page_url, client)) {
            throw new MangaContentPageExistError(manga.content_page_url);
        }
        const ret = await addMangaToDB_(manga, client);

        await client.query('COMMIT');
        return ret;
    }
    catch (ex) {
        await client.query('ROLLBACK');
        throw ex;
    }
    finally {
        client.release();
    }
}

export async function addMangaToDB_(manga: IBaseManga, sharedClient: PoolClient): Promise<IManga> {

    const client = sharedClient;

    try {
        const insertMangaText = `
        INSERT INTO manga (name, description, content_page_url, cover_image, last_update)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
        ;`;

        const mangaValues = [
            manga.name,
            manga.description,
            manga.content_page_url,
            manga.cover_image,
            manga.last_update
        ];

        const queryRes = await client.query(insertMangaText, mangaValues);

        const rows = queryRes.rows;

        const ret: IManga = {
            id: rows[0].id,
            name: manga.name,
            content_page_url: manga.content_page_url,
            cover_image: manga.cover_image,
            description: manga.description,
            chapters: {},
            last_update: manga.last_update
        };

        const insertChapterText = `
        INSERT INTO chapter (manga_id, num, url, release_date)
        VALUES ($1, $2, $3, $4) RETURNING id
        ;`;

        const queryPromises: Promise<QueryResult>[] = [];

        manga.chapters.forEach((chap) => {
            const chapterValues = [ret.id, chap.num, chap.url, chap.release_date];

            queryPromises.push(client.query(insertChapterText, chapterValues));
        });

        const chaptersQueries = await Promise.all(queryPromises);

        for (let i = 0; i < manga.chapters.length; i++) {
            const id = chaptersQueries[i].rows[0].id;
            ret.chapters[id] = {
                id: id,
                num: manga.chapters[i].num,
                url: manga.chapters[i].url,
                release_date: manga.chapters[i].release_date
            };
        }

        return ret;
    }
    catch (ex) {
        log.error("Error when trying to insert a manga !", ex, manga);
        throw ex;
    }
}

export async function refreshMangaLastUpdate_(manga_id: number, sharedClient: PoolClient): Promise<void> {

    const client = sharedClient;

    try {
        const updateMangaText = `
        UPDATE manga 
        SET last_update = $1
        WHERE id = $2;
        ;`;

        const mangaValues = [
            new Date(),
            manga_id
        ];

        await client.query(updateMangaText, mangaValues);
    }
    catch (ex) {
        log.error("Error when trying to refresh manga update date on manga with id [" + manga_id + "] !", ex);
        throw ex;
    }
}

/**
 * 
 * @throws MangaIdNotFoundError
 */
export async function updateMangaInfo(baseManga: IBaseManga): Promise<IManga> {

    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        if (!await mangaExistByContentUrl_(baseManga.content_page_url, client)) {
            throw new MangaWithContentPageNotFoundError(baseManga.content_page_url);
        }
        await updateMangaInfo_(baseManga, client);
        
        await client.query('COMMIT');
        const ret = await getMangaByContentUrl_(baseManga.content_page_url, client);
        return ret;
    }
    catch (ex) {
        await client.query('ROLLBACK');
        throw ex;
    }
    finally {
        client.release();
    }
}

export async function updateMangaInfo_(baseManga: IBaseManga, sharedClient: PoolClient): Promise<void> {

    const client = sharedClient;

    try {
        const updateMangaText = `
        UPDATE manga 
        SET
            name = $1,
            description = $2,
            cover_image = $3,
            last_update = $4
        WHERE content_page_url = $5;
        ;`;

        const mangaValues = [
            baseManga.name,
            baseManga.description,
            baseManga.cover_image,
            new Date(),
            baseManga.content_page_url,
        ];

        await client.query(updateMangaText, mangaValues);
    }
    catch (ex) {
        log.error("Error when trying to update manga [" + baseManga.name + "] !", ex);
        throw ex;
    }
}

/**
 * 
 * @throws MangaContentPageNotFoundError
 */
export async function getMangaByContentUrl(contentUrl: string): Promise<IManga> {

    const client = await getPool().connect();

    try {
        await client.query('BEGIN');

        const ret = await getMangaByContentUrl_(contentUrl, client);

        await client.query('COMMIT');
        return ret;
    }
    catch (ex) {
        await client.query('ROLLBACK');
        throw ex;
    }
    finally {
        client.release();
    }
}

export async function mangaExistByContentUrl(contentUrl: string): Promise<boolean> {

    const client = await getPool().connect();

    try {
        return await mangaExistByContentUrl_(contentUrl, client);
    }
    finally {
        client.release();
    }
}

/**
 * 
 * @throws MangaContentPageNotFoundError
 */
export async function getMangaByContentUrl_(contentUrl: string, sharedClient: PoolClient): Promise<IManga> {

    const client = sharedClient;

    const queryText = `
    SELECT M.id m_id, *, C.id chapter_id FROM manga as M
    LEFT JOIN chapter as C
    ON M.id = C.manga_id 
    WHERE M.content_page_url = $1
    ORDER BY C.release_date DESC
    ;`;

    const values = [contentUrl];

    try {
        const queryRes = await client.query(queryText, values);
        if (queryRes.rowCount === 0) {
            throw new MangaContentPageNotFoundError(contentUrl);
        }

        return Object.values(rowsToMangaMap(queryRes.rows))[0];
    }
    catch (ex) {
        if (!(ex instanceof MangaContentPageNotFoundError)) {
            log.error("Error when trying to get manga with content url [" + contentUrl + "] !", ex);
        }
        throw ex;
    }
}

export async function mangaExistByContentUrl_(contentUrl: string, sharedClient: PoolClient): Promise<boolean> {

    const client = sharedClient;

    const queryText = `
    SELECT id FROM manga as m
    WHERE m.content_page_url = $1
    ;`;

    const values = [contentUrl];

    try {
        const queryRes = await client.query(queryText, values);
        if (queryRes.rowCount === 1) {
            return true;
        }
        return false;
    }
    catch (ex) {
        log.error("Error when trying to check if manga with content url [" + contentUrl + "] exist.", ex);
        throw ex;
    }
}

export async function mangaExistById_(manga_id: number, sharedClient: PoolClient): Promise<boolean> {

    const client = sharedClient;

    const queryText = `
    SELECT id FROM manga as m
    WHERE m.id = $1
    ;`;

    const values = [manga_id];

    try {
        const queryRes = await client.query(queryText, values);
        if (queryRes.rowCount === 1) {
            return true;
        }
        return false;
    }
    catch (ex) {
        log.error("Error when trying to check if manga with id [" + manga_id + "] exist.", ex);
        throw ex;
    }
}

function rowsToMangaMap(rows: any[]): IMangaMap {
    const ret: IMangaMap = {};

    rows.forEach((row) => {
        if (!ret[row.m_id]) {
            ret[row.m_id] = {
                id: row.m_id,
                name: row.name,
                description: row.description,
                content_page_url: row.content_page_url,
                cover_image: row.cover_image,
                chapters: {},
                last_update: row.last_update
            };
        }

        if (row.chapter_id) {
            ret[row.m_id].chapters[row.chapter_id] = {
                id: row.chapter_id,
                num: row.num,
                url: row.url,
                release_date: row.release_date
            };
        }
    });


    return ret;
}