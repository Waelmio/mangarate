import { ContentPageNotFoundError } from "../../common/Error";
import { BaseChapter } from "../../Models/Chapter";
import { MangaInfoProvider } from "../MangaInfoProvider";
import { Logger } from "tslog";
import cheerio from 'cheerio';

const log = new Logger();

export class ReadmanganatoProviderInfo extends MangaInfoProvider {
    hostname = "readmanganato.com";

    async findContentPageUrl(url: string): Promise<string> {
        let contentUrlTry = url;
        // Accepting three patterns:
        // eslint-disable-next-line no-useless-escape
        const rePattern = new RegExp(/^http([^\.]*)\.(.*?)\/([^\/]*)/);

        const patternArray = contentUrlTry.match(rePattern);
        if (!patternArray) {
            throw new ContentPageNotFoundError(this.hostname, url);
        }
        contentUrlTry = patternArray[0];

        return contentUrlTry;
    }

    async getName(): Promise<string> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const jsPath = "body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-info > div.story-info-right > h1";
            return cheerioDoc(jsPath).text().trim();
        }
        catch (ex) {
            log.error("There was an error getting the Manga Title at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }

    async getDescription(): Promise<string> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const jsPath = "#panel-story-info-description";
            // Replacing <br ... /> balises by \n, allowing us to keep line break.
            cheerioDoc(jsPath).find('br').replaceWith('\n');
            return cheerioDoc(jsPath).text().trim().replace('Description :\n', '');
        }
        catch (ex) {
            log.error("There was an error getting the Manga description at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }

    async getAllChapters(): Promise<BaseChapter[]> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const chapterListPath = "body > div.body-site > div.container.container-main > div.container-main-left > div.panel-story-chapter-list > ul";

            const chapterListHtml = cheerioDoc(chapterListPath).html();

            if (!chapterListHtml) {
                throw new Error("Could not get chapter list HTML !");
            }

            const cheerioChaps = cheerio.load(chapterListHtml);

            const ret: BaseChapter[] = [];

            // Match any integer that is between /chapter- and the end
            // Or between /chapter- and the last /.
            const numInUrlPattern = new RegExp(/(?<=\/chapter-)\d+(\.\d+)?((?=\/$)|$)/);

            let err_num = 0;
            let last_bad_url = "";

            cheerioChaps('a').each((i, el) => {
                const chapterUrl = el.attribs["href"];

                if (!chapterUrl) {
                    throw new Error(`Could not get chapter url for the ${i}th chapter of the list !`);
                }

                const chapterNumReg = chapterUrl.match(numInUrlPattern);

                if (!chapterNumReg) {
                    err_num += 1;
                    last_bad_url = chapterUrl;
                    log.warn("A chapter was ignored: " + chapterUrl);
                    return;                }

                const chapterNum = Number(chapterNumReg[0]);

                if (isNaN(chapterNum)) {
                    err_num += 1;
                    last_bad_url = chapterUrl;
                    log.warn("A chapter was ignored: " + chapterUrl);
                    return;
                }

                const chap: BaseChapter = {
                    num: chapterNum,
                    url: chapterUrl,
                    release_date: new Date()
                };
                ret.push(chap);
            });

            // Allow up to 2% errors in getting chapters
            const max_error = Math.round(ret.length + err_num / 100 * 2);
            if (err_num > max_error)  {
                throw new Error(`Could not extract chapter num from url in more than 2% chapters. Example: ${last_bad_url} !`);
            }
            
            return ret;
        }
        catch (ex) {
            log.error("There was an error extracting the Manga chapters list at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }
}