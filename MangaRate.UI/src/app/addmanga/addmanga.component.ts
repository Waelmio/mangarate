import { Component } from '@angular/core';
import { environment } from "src/environments/environment";
import { FollowedMangasFacade } from '@core/store/followed-mangas/followed-mangas.facade';

@Component({
  selector: 'app-addmanga',
  templateUrl: './addmanga.component.html',
  styleUrls: ['./addmanga.component.css']
})
export class AddMangaComponent {
    mangaToAddUrl: string = "";

    constructor(
        private _followedMangasFacade: FollowedMangasFacade
    ) { }
    public root_url = environment.api.baseUrl;

    subscribeToManga(url: string): void {
        this._followedMangasFacade.followManga(url);
        this.mangaToAddUrl = "";
    }
}
