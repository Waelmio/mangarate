import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Manga } from '@core/Models/API/Manga';

@Component({
    selector: 'app-followed-mangas-display',
    templateUrl: './followed-mangas-display.component.html',
    styleUrls: ['./followed-mangas-display.component.css']
})
export class FollowedMangasDisplayComponent implements OnChanges {
    @Input() mangas: Manga[] = [];
    
    orderedMangas: Manga[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        const mangas = changes["mangas"].currentValue as Manga[];
        this.orderedMangas = mangas.sort((mangaA, mangaB) =>
            Object.keys(mangaB.chapters).length - Object.keys(mangaA.chapters).length
        );
    }
}
