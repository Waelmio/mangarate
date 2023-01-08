import { Component } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-addmanga',
  templateUrl: './addmanga.component.html',
  styleUrls: ['./addmanga.component.css']
})
export class AddMangaComponent {

    constructor(private _httpClient: HttpClient) { }
    public root_url = environment.api.baseUrl;

    subscribeToManga(url: string): void {
        const requestUrl = this.root_url + `api/manga`;
        console.log("I was called for " + JSON.stringify(url));
        const params = new HttpParams().set('url', url);

        this._httpClient.put(
            requestUrl,
            {},
            {'params': params}
        ).subscribe();
    }
}