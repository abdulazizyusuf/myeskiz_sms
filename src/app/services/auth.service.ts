import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { env } from "../../environments/environment";
import { map, tap, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AccountService } from './account.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private AccountApi = inject(AccountService);

  readonly baseUrl;
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private loggedUser: string = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.baseUrl = env.apiUrl;
  }

  login(data): Observable<boolean> {
    return this.httpClient.post<any>(`${this.baseUrl}/api/auth/logins`, data).pipe(
      tap((tokens) => this.storeTokens(tokens)),
      map((res) => {
        return res;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  refreshToken(token: string) {
    return this.httpClient.post(this.baseUrl + '/api/auth/refresh-tokens', {
      access_token: token
    }, httpOptions);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  logout() {
    this.AccountApi.logout().subscribe((res: any) => {
      if (res.success) {
        this.loggedUser = '';
        this.removeTokens();
        this.router.navigate(["/"]);
      }
    })
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  storeTokens(res) {
    if (res.access_token) {
      localStorage.setItem(this.JWT_TOKEN, res.access_token);
      let user = btoa(unescape(encodeURIComponent(JSON.stringify(res.result))));
      localStorage.setItem('SD', user);
    }
    else
      this.removeTokens();
  }

  removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem('SD');
  }

}
