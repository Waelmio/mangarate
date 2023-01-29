import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Observable } from 'rxjs';
import { map, finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FollowedMangasService } from './followed-mangas.service';
import { FollowedMangasState } from './followed-mangas.store';
import { Manga } from '@core/Models/API/Manga';
import { LoadFollowedMangas } from './followed-mangas.actions';

@Injectable({ providedIn: 'root' })
export class FollowedMangasFacade {
  @Select(FollowedMangasState.allFollowedMangas)
    public mangas$!: Observable<Manga[]>;

  constructor(
    private followedMangasService: FollowedMangasService,
    private spinner: NgxSpinnerService
  ) {}

  @Dispatch()
  public loadAll = () => {
    this.spinner.show();
    return this.followedMangasService.getAllFollowedMangas()
        .pipe(
            map((mangas) => new LoadFollowedMangas(mangas)),
            finalize(() => this.spinner.hide())
        );
  };

  public followManga = (content_page_url: string) => {
    this.spinner.show();
    return this.followedMangasService.followManga(content_page_url)
        .pipe(
            tap(_ => this.loadAll()),
            finalize(() => this.spinner.hide())
        ).subscribe();
  };
}
