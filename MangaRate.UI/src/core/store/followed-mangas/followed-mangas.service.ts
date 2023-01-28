import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, pipe, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
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

    private catchErrorAndRetry<T>() {
        return pipe(
            catchError(this.handleIntermediateError.bind(this)),
            retry<T>({ count: this.retryTimes, delay: this.retryDelay })
        );
    }

    private handleIntermediateError(error: HttpErrorResponse) {
        const error_code = error.status;
        let http_error_message = error.message;
        try {
            http_error_message = JSON.parse(error.message).message;
        }
        catch (err) {
            // Response error was not JSON
        }

        const error_message = `Error ${error_code}: ${http_error_message}. \n`;
        console.error(error_message, error);
        
        this.alert.error("Error while trying to reach API. Retrying in 1s...", 1500);

        return throwError(() => error);
    }
}
