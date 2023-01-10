import { Component } from '@angular/core';
import { FollowedMangasFacade } from '@core/store/followed-mangas/followed-mangas.facade';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'MangaRate';

    constructor(
        private followedMangasFacade: FollowedMangasFacade
    ) {
        followedMangasFacade.loadAll();
    }
}
