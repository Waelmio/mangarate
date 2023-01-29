export class NotImplementedError extends Error {
    constructor() {
        const message = "Method was not implemented.";
        super(message);
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}

export class ProviderNotImplemented extends Error {
    provider: string;
    constructor(provider: string) {
        const message = "Provider [" + provider + "] was not implemented.";
        super(message);
        this.provider = provider;
        Object.setPrototypeOf(this, ProviderNotImplemented.prototype);
    }
}

export class BadUrlException extends Error {
    badUrl: string;
    constructor(badUrl: string) {
        const message = "\"" + badUrl + "\" is not an url.";
        super(message);
        this.badUrl = badUrl;
        Object.setPrototypeOf(this, BadUrlException.prototype);
    }
}

export class ContentPageNotFoundError extends Error {
    badUrl: string;
    provider: string;
    constructor(provider: string, badUrl: string) {
        const message = "The url \"" 
        + badUrl 
        + "\" didn't allow us to find the content page of the related manga for the provider [" 
        + provider + "].";
        super(message);
        this.badUrl = badUrl;
        this.provider = provider;
        Object.setPrototypeOf(this, ContentPageNotFoundError.prototype);
    }
}

export class MangaContentPageNotFoundError extends Error {
    contentUrl: string;
    constructor(contentUrl: string) {
        const message = "There is no manga with content page at url \"" 
        + contentUrl 
        + "\"." ;
        super(message);
        this.contentUrl = contentUrl;
        Object.setPrototypeOf(this, MangaContentPageNotFoundError.prototype);
    }
}

export class MangaContentPageExistError extends Error {
    contentUrl: string;
    constructor(contentUrl: string) {
        const message = "There is already a manga with content page at url \"" 
        + contentUrl 
        + "\"." ;
        super(message);
        this.contentUrl = contentUrl;
        Object.setPrototypeOf(this, MangaContentPageExistError.prototype);
    }
}

export class MangaIdNotFoundError extends Error {
    mangaId: number;
    constructor(mangaId: number) {
        const message = "Manga of id [" + mangaId + "] was not found in DB.";
        super(message);
        this.mangaId = mangaId;
        Object.setPrototypeOf(this, MangaIdNotFoundError.prototype);
    }
}

export class MangaWithContentPageNotFoundError extends Error {
    manga_content_url: string;
    constructor(manga_content_url: string) {
        const message = "Manga of content page [" + manga_content_url + "] was not found in DB.";
        super(message);
        this.manga_content_url = manga_content_url;
        Object.setPrototypeOf(this, MangaIdNotFoundError.prototype);
    }
}

export class ChapterIdNotFoundError extends Error {
    chapterId: number;
    constructor(chapterId: number) {
        const message = "Chapter of id [" + chapterId + "] was not found.";
        super(message);
        this.chapterId = chapterId;
        Object.setPrototypeOf(this, ChapterIdNotFoundError.prototype);
    }
}