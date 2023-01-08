import axios from "axios";
import { ContentPageNotFoundError } from "../common/Error";
import { BaseChapter } from "../Models/Chapter";

export abstract class MangaInfoProvider {
    /**
     * Name of the provider.
     */
    abstract name: string;
    /**
     * Array of hostnames
     * 
     * The hostname need to be the hostname of the provider.
     * 
     * It needs to be without 'http://', 'https://', 'wwww.'
     * 
     * e.g. 'readmng.com'
     * 
     * It needs to be added to the switch case in MangaInfoProvider.factory as well.
    */
    static hostnames: string[] = [];

   contentPageUrl = "";
   contentPageHtml = "";

    async setup(givenPageUrl: string): Promise<void> {
        this.contentPageUrl = await this.findContentPageUrl(givenPageUrl);

        try {
            await this.updateContentPageHtml();
        }
        catch (ex) {
            throw new ContentPageNotFoundError(this.name, givenPageUrl);
        }
    }

    async updateContentPageHtml(): Promise<void> {
        const res = await axios.get(this.contentPageUrl, {
            validateStatus: function (status) {
                return status === 200; // Any status code other than 200 is an error
            }
        });
        this.contentPageHtml = res.data;
    }

    /**
     * Try to return the content page's url of a manga from an URL.
     * 
     * It should always return the same for a given manga.
     * 
     * If it fails, it throws an error.
     * @throws ContentPageNotFoundError
     */
    abstract findContentPageUrl(url: string): Promise<string>;

    /**
     * Get all chapters from the manga.
     */
    abstract getAllChapters(): Promise<BaseChapter[]>;

    /**
     * Get the name of the manga.
     */
    abstract getName(): Promise<string>;

    /**
     * Get the description of the manga.
     */
    abstract getDescription(): Promise<string>;
}