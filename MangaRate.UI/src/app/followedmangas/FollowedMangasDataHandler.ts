import { HttpClient } from "@angular/common/http";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { Chapter } from "../../../../MangaRate.Api/src/Models/Chapter";
import { Manga } from "../../../../MangaRate.Api/src/Models/Manga";

export class FollowedMangasDataHandler {

    public root_url = environment.api.baseUrl;

    public followed_source = new MatTableDataSource<Manga>();

    public sorter: MatSort | null = null;

    public chapters_sources: { [id: string]: MatTableDataSource<Chapter> } = {};

    private is_expanded: { [id: string]: boolean } = {};
    private expanded_amount = 0;

    constructor(private _httpClient: HttpClient) {
        this.refresh();
    }

    refreshFollowedMangas(): Observable<Manga[]> {
        const requestUrl = this.root_url + `api/notification`;

        return this._httpClient.get<Manga[]>(requestUrl)
            .pipe(
                map(mangas => {
                    if (mangas === null) {
                        return [];
                    }
                    return mangas;
                }),
                tap(mangas => {
                    const is_expanded_temp: { [id: string]: boolean } = {};
                    const chapters_sources_temp: { [id: string]: MatTableDataSource<Chapter> } = {};

                    let expanded_amount_temp = 0;

                    mangas.map(manga => {
                        // We check which row were expanded in the UI and mark them as expanded.
                        const id = manga.id.toString();
                        const is_exp = !!this.is_expanded[id];

                        is_expanded_temp[id] = is_exp;

                        if (is_exp) {
                            expanded_amount_temp += 1;
                        }

                        // We take the chapters out and put them in their own DataSources
                        chapters_sources_temp[id] = id in this.chapters_sources ?
                            this.chapters_sources[id] : new MatTableDataSource<Chapter>();
                        
                        const the_chaps: Chapter[] = [];
                        const old_chaps = chapters_sources_temp[id].data;
                        // for (const chap_id in manga.chapters) {
                        //     if (chap_id in chapters_sources_temp[id].data) {
                        //         chapters_sources_temp[id].data;
                        //     }
                        // }

                        chapters_sources_temp[id].data = 
                            this.updateChapters(Object.values(manga.chapters), chapters_sources_temp[id].data);
                        manga.chapters = {};
                    });

                    this.expanded_amount = expanded_amount_temp;
                    this.is_expanded = is_expanded_temp;
                    this.chapters_sources = chapters_sources_temp;
                })
            );
    }

    getChapterSource(manga: Manga): MatTableDataSource<Chapter> {
        return this.chapters_sources[manga.id.toString()];
    }

    markChapterAsRead(chapter: Chapter): void {
        const requestUrl = this.root_url + `api/notification/chapter/` + chapter.id;
        console.log("I was called for " + JSON.stringify(chapter));

        this._httpClient.delete(requestUrl).subscribe(() => this.refresh());
    }

    markMangaAsRead(manga: Manga): void {
        const requestUrl = this.root_url + `api/notification/manga/` + manga.id;
        console.log("I was called for " + JSON.stringify(manga));

        this._httpClient.delete(requestUrl).subscribe(() => this.refresh());
    }

    refresh(): void {
        this.refreshFollowedMangas().subscribe(data => {
            if (this.followed_source.data.length) return;
            this.followed_source.data = data;
            this.followed_source.sort = this.sorter;
        });
    }

    toggleRow(row: Manga): void {
        const is_it_exp = this.isExpanded(row);
        if (is_it_exp) {
            this.expanded_amount -= 1;
        }
        else {
            this.expanded_amount += 1;
        }
        this.is_expanded[row.id.toString()] = !is_it_exp;
    }

    isExpanded(row: Manga): boolean {
        return !!this.is_expanded[row.id.toString()];
    }

    isAllRowsCollapsed(): boolean {
        return this.expanded_amount === 0;
    }

    toggleAllRows(): void {
        const uncollapse = this.isAllRowsCollapsed();

        // If all rows are collapsed, then we open them all
        this.expanded_amount = uncollapse ? this.followed_source.data.length : 0;

        for (const key in this.is_expanded) {
            this.is_expanded[key] = uncollapse;
        }
    }

    private updateChapters(newChapters: Chapter[], oldChapters: Chapter[]): Chapter[] {
        const ret: Chapter[] = [];
        const old_dic: { [id: string]: Chapter } = {};

        oldChapters.forEach(chapter => {
            old_dic[chapter.id.toString()] = chapter;
        });

        newChapters.forEach(new_chap => {
            if (new_chap.id.toString() in old_dic) {
                const old_chap = old_dic[new_chap.id.toString()];
                old_chap.num = new_chap.num;
                old_chap.release_date = new_chap.release_date;
                old_chap.url = new_chap.url;

                ret.push(old_chap);
            }
            else {
                ret.push(new_chap);
            }
        });

        return ret;
    }
}