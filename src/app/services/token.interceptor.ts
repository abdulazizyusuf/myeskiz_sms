import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private AuthApi = inject(AuthService);


  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.AuthApi.isAuthenticated()) {
      request = this.addToken(request, this.AuthApi.getToken());
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        else {
          return throwError(error);
        }
      })
     )
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.AuthApi.getToken();
      if (token)
        return this.AuthApi.refreshToken(token).pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;
            this.AuthApi.storeTokens(res);
            this.refreshTokenSubject.next(res.access_token);

            if(localStorage.getItem('version_app') && localStorage.getItem('version_app') != res.version)
              localStorage.setItem('reload_page','1');

            localStorage.setItem('version_app',res.version);

            return next.handle(this.addToken(request, res.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.AuthApi.logout();
            setTimeout(()=>{
              location.reload();
            },1000);
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }

}
