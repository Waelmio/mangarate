import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Manga } from '../Models/API/Manga';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ChapterMap } from '../Models/API/ChapterMap';
import { Chapter } from '../Models/API/Chapter';
import { MatTableDataSource } from '@angular/material/table';
import { FollowedMangasDataHandler } from './FollowedMangasDataHandler';


@Component({
    selector: 'app-followedmangas',
    templateUrl: './followedmangas.component.html',
    styleUrls: ['./followedmangas.component.css'],

    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
        trigger('deleteRow', [
            state(
                'void',
                style({ height: '0px', minHeight: '0', background: 'red', opacity: '0' })
            ),
            state('*', style({ height: '*' })),
            transition('* => void', [animate('1000ms cubic-bezier(0.4, 0.0, 0.2, 1)')]),
        ])
    ],
})

export class FollowedMangasComponent implements AfterViewInit, OnInit {
    displayedColumns: string[] = [
        'expand',
        'name',
        'content_page_url',
        'last_update',
        'read_manga',
    ];

    chaptersColumns: string[] = [
        'num',
        'url',
        'release_date',
        'read_chapter',
    ];

    followedSourceHandler!: FollowedMangasDataHandler;
    @ViewChild(MatSort) sorter!: MatSort;

    constructor(private _httpClient: HttpClient) { }

    ngOnInit(): void {
        this.followedSourceHandler = new FollowedMangasDataHandler(this._httpClient);
    }

    ngAfterViewInit(): void {
        this.followedSourceHandler.sorter = this.sorter;
    }

    getDateString(the_date_str: string) {
        const the_date = new Date(the_date_str);
        return the_date.toLocaleDateString("fr-FR");
    }

    isAllRowsCollapsed() {
        return this.followedSourceHandler.isAllRowsCollapsed();
    }

    isExpanded(row: Manga): boolean {
        return this.followedSourceHandler.isExpanded(row);
    }

    toggleAllRows() {
        this.followedSourceHandler.toggleAllRows();
    }

    toggleRow(row: Manga) {
        this.followedSourceHandler.toggleRow(row);
    }

    getChapterSource(manga: Manga): MatTableDataSource<Chapter> {
        return this.followedSourceHandler.getChapterSource(manga);
    }

    getChaptersArray(chapters: ChapterMap): Chapter[] {
        return Object.values(chapters);
    }

    markChapterAsRead(chapter: Chapter) {
        this.followedSourceHandler.markChapterAsRead(chapter);
    }

    markMangaAsRead(manga: Manga) {
        this.followedSourceHandler.markMangaAsRead(manga);
    }
}