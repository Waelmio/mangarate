import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root',
})
export class AlertsService {
    constructor(private toastr: ToastrService) { }

    defaultAlertsOptions = {
        timeOut: 6000,
        extendedTimeOut: 2000,
        progressBar: true,
        positionClass: 'toast-bottom-center',
        onActivateTick: true
    }

    private getOptions(timeOut?: number | undefined) {
        var options = {
            ...this.defaultAlertsOptions
        }
        options.timeOut = timeOut ?? this.defaultAlertsOptions.timeOut;

        return options;
    }

    public error(message: string, timeOut?: number | undefined) {
        this.toastr.error(undefined, message, this.getOptions(timeOut));
    }

    public warn(message: string, timeOut?: number | undefined) {
        this.toastr.warning(undefined, message, this.getOptions(timeOut));
    }

    public success(message: string, timeOut?: number | undefined) {
        this.toastr.success(undefined, message, this.getOptions(timeOut));
    }

    public info(message: string, timeOut?: number | undefined) {
        this.toastr.info(undefined, message, this.getOptions(timeOut));
    }
}