import { Component } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
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
        // const requestUrl = this.root_url + `api/manga`;
        // const params = new HttpParams().set('url', url);

        // this._httpClient.put(
        //     requestUrl,
        //     {},
        //     {'params': params}
        // ).subscribe();
        this._followedMangasFacade.followManga(url);
        this.mangaToAddUrl = "";
    }
}
