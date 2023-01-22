import { Component, Input, OnInit } from '@angular/core';
import { Chapter } from '@core/Models/API/Chapter';
import { Manga } from '@core/Models/API/Manga';

@Component({
    selector: 'app-followed-manga',
    templateUrl: './followed-manga.component.html',
    styleUrls: ['./followed-manga.component.css']
})
export class FollowedMangaComponent implements OnInit {
    @Input() manga!: Manga;

    chapters: Chapter[] = [];

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
    }

    markAllChaptersRead(e: Event) {
        e.stopPropagation();
    }
}
