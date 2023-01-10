import { Component } from '@angular/core';
import { Manga } from '@core/Models/API/Manga';
import { FollowedMangasFacade } from '@core/store/followed-mangas/followed-mangas.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-followed-mangas-display-container',
  templateUrl: './followed-mangas-display-container.component.html',
  styleUrls: ['./followed-mangas-display-container.component.css']
})
export class FollowedMangasDisplayContainerComponent {
    mangas$: Observable<Manga[]>;

    constructor(
        private fdMangasFacade: FollowedMangasFacade
    ) {
        this.mangas$ = fdMangasFacade.mangas$;
    }

}
