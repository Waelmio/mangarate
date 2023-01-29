import { Component, Input, OnInit } from '@angular/core';
import { Chapter } from '@core/Models/API/Chapter';
import { Manga } from '@core/Models/API/Manga';
import { FollowedMangasFacade } from '@core/store/followed-mangas/followed-mangas.facade';

@Component({
    selector: 'app-followed-manga',
    templateUrl: './followed-manga.component.html',
    styleUrls: ['./followed-manga.component.css']
})
export class FollowedMangaComponent implements OnInit {
    @Input() manga!: Manga;

    chapters: Chapter[] = [];

    constructor(
        private _followedMangasFacade: FollowedMangasFacade
      ) {}

    ngOnInit(): void {
        this.chapters = Object.values(this.manga.chapters);
    }

    linkToNextChapter(): string {
        return this.chapters[0].url;
    }

    getChaptersToRead(): string {
        if (this.chapters.length > 1) {
            return this.chapters[0].num + ' > ' + this.chapters[this.chapters.length - 1].num;
        }
        else if (this.chapters.length == 1) {
            return this.chapters[0].num + '';
        }
        else {
            return '-';
        }
    }

    openAndMarkChapterRead(e: Event) {
        e.stopPropagation();
        window.open(this.chapters[0].url, "_blank");
        this._followedMangasFacade.markChapterAsRead(this.chapters[0]);
    }

    openContentPage() {
        window.open(this.manga.content_page_url, "_blank");
    }

    markMangaAsRead(e: Event) {
        e.stopPropagation();
        this._followedMangasFacade.markMangaAsRead(this.manga);
    }
}
