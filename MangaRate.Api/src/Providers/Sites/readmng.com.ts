import { ContentPageNotFoundError } from "../../common/Error";
import { IBaseChapter } from "../../Models/API/Chapter";
import { MangaInfoProvider } from "../MangaInfoProvider";
import { Logger } from "tslog";
import cheerio from 'cheerio';

const log = new Logger();

export class ReadmngcomProviderInfo extends MangaInfoProvider {
    static hostnames = ["readmng.com"];

    name = "ReadMangaToday";

    async findContentPageUrl(url: string): Promise<string> {
        let contentUrlTry = url;
        // Accepting three patterns:
        // eslint-disable-next-line no-useless-escape
        const rePattern = new RegExp(/^http([^\.]*)\.(.*?)\/([^\/]*)/);

        const patternArray = contentUrlTry.match(rePattern);
        if (!patternArray) {
            throw new ContentPageNotFoundError(this.name, url);
        }
        contentUrlTry = patternArray[0];

        return contentUrlTry;
    }

    async getName(): Promise<string> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const jsPath = "body > div.content > div > div.col-single.col-md-8 > div > div > div.row.movie-meta > div > div > div.panel-heading.clearfix > h1";
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
            const jsPath = "body > div.content > div > div.col-single.col-md-8 > div > div > div.row.movie-meta > div > div > ul > li.list-group-item.movie-detail > p";
            // Replacing <br ... /> balises by \n, allowing us to keep line break.
            cheerioDoc(jsPath).find('br').replaceWith('\n');
            return cheerioDoc(jsPath).text().trim();
        }
        catch (ex) {
            log.error("There was an error getting the Manga description at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }

    async getCoverImageUrl(): Promise<string> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const jsPath = "#content > div > div > div.col-12.col-md-12.col-lg-9 > div > div:nth-child(1) > div > div.productLeft > div > div.thumb > a > img";

            const url = cheerioDoc(jsPath).attr("src");

            if (!url) {
                throw new Error("Url for cover image was null.");
            }
            return url.trim();
        }
        catch (ex) {
            log.error("There was an error getting the Manga description at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }

    async getAllChapters(): Promise<IBaseChapter[]> {
        try {
            const cheerioDoc = cheerio.load(this.contentPageHtml);
            const chapterListPath = "#chapters_container > div > div > div.panel-body";

            const chapterListHtml = cheerioDoc(chapterListPath).html();

            if (!chapterListHtml) {
                throw new Error("Could not get chapter list HTML !");
            }

            const cheerioChaps = cheerio.load(chapterListHtml);
            const chapterAmount = cheerioChaps('ul').children().length;

            const ret: IBaseChapter[] = [];

            // Match anything that is between a / and the end
            // Or between a / and another / then the end.
            const numInUrlPattern = new RegExp(/(?<=\/)\d+(\.\d+)?((?=\/$)|$)/);

            let err_num = 0;

            // Allow up to 2% errors in getting chapters
            const max_error = Math.round(chapterAmount / 100 * 2);

            for (let i = chapterAmount; i >= 1; --i) {
                const jsChapterUrlPath = `ul > li:nth-child(${i}) > a`;
                let chapterUrl = cheerioChaps(jsChapterUrlPath).attr('href');

                if (!chapterUrl) {
                    throw new Error(`Could not get chapter url for the ${i}th chapter of the list !`);
                }

                const chapterNumReg = chapterUrl.match(numInUrlPattern);

                if (!chapterNumReg) {
                    err_num += 1;
                    if (err_num > max_error)  {
                        throw new Error(`Could not extract chapter num from url in more than 2% chapters. Example: ${chapterUrl} !`);
                    }
                    log.warn("A chapter was ignored: " + chapterUrl);
                    continue;                }

                const chapterNum = Number(chapterNumReg[0]);

                if (isNaN(chapterNum)) {
                    err_num += 1;
                    if (err_num > max_error)  {
                        throw new Error(`Could not extract chapter num from url in more than 2% chapters. Example: ${chapterUrl} !`);
                    }
                    log.warn("A chapter was ignored: " + chapterUrl);
                    continue;
                }

                chapterUrl = chapterUrl.endsWith('/') ?
                    chapterUrl + 'all-pages' :
                    chapterUrl + '/all-pages';

                const chap: IBaseChapter = {
                    num: chapterNum,
                    url: chapterUrl,
                    release_date: new Date()
                };
                ret.push(chap);
            }

            return ret;
        }
        catch (ex) {
            log.error("There was an error extracting the Manga chapters list at url \"" + this.contentPageUrl + "\".", ex);
            throw ex;
        }
    }
}