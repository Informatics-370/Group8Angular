import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SpinnerService } from './services/spinner.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
    constructor(private spinnerService: SpinnerService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        this.spinnerService.isLoading.next(true);
        return next.handle(request).pipe(
            finalize(() => this.spinnerService.isLoading.next(false))
        );
    }
}
