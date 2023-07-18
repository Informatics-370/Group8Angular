import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

if (localStorage.getItem('Token')) {
  const jwt = JSON.parse(localStorage.getItem('Token')!)
  const token = jwt.token

  const cloned = req.clone({
      headers: req.headers.set("Authorization",
          "Bearer " + token)
  });

   return next.handle(cloned);
}
else {
  return next.handle(req);
}
}
}
