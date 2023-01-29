import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, pipe, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Manga } from '@core/Models/API/Manga';
import { AlertsService } from '@core/alerts/alerts.service';


@Injectable({ providedIn: 'root' })
export class FollowedMangasService {

    retryDelay = 1000;
    retryTimes = 3;

    private baseUrl: string;

    public constructor(
        private http: HttpClient,
        private alert: AlertsService
    ) {
        this.baseUrl = environment.api.baseUrl;
    }

    public getAllFollowedMangas(): Observable<Manga[]> {
        return this.http
            .get<Manga[]>(`${this.baseUrl}api/notification`)
            .pipe(this.catchErrorAndRetry<Manga[]>())
            .pipe(catchError(() => {
                this.alert.error("Unable to retrieve followed mangas. Please retry later.");
                return of([]);
            }));
    }

    public followManga(content_page_url: string): Observable<Manga> {
        const params = new HttpParams().set('url', content_page_url);
        return this.http
            .put<Manga>(
                `${this.baseUrl}api/manga`,
                {},
                {'params': params}
            )
            .pipe(
                catchError(this.handleIntermediateError.bind(this)),
                tap((manga) => this.alert.success(`${manga.name} added !`))
            );
    }


    public markChapterAsRead(chapter_id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.baseUrl}api/notification/chapter/${chapter_id}`)
            .pipe(
                catchError(this.handleIntermediateError.bind(this))
            );
    }

    public markMangaAsRead(manga_id: number): Observable<void> {
        return this.http
            .delete<void>(`${this.baseUrl}api/notification/manga/${manga_id}`)
            .pipe(
                catchError(this.handleIntermediateError.bind(this))
            );
    }

    private catchErrorAndRetry<T>() {
        return pipe(
            catchError(this.handleIntermediateError.bind(this)),
            retry<T>({ count: this.retryTimes, delay: this.retryDelay })
        );
    }

    private handleIntermediateError(error: HttpErrorResponse) {
        const error_code = error.status;
        let http_error_message = error.message;
        let error_message = `Server Error ${error_code}: ${http_error_message}.`;
        
        try {
            // Response error is our ApiResponseError
            if (error.error.message) {
                http_error_message = error.error.message;
                error_message = `Error: ${http_error_message}`;
            }
        }
        catch (err) {}

        console.error(error_message + "\n", error);
        
        this.alert.error(error_message);

        return throwError(() => error);
    }
}
