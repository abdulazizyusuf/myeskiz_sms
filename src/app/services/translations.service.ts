import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { env } from "../../environments/environment";
import { Observable, of, map, tap } from 'rxjs'; 

@Injectable()
export class AsyncTranslate implements TranslateLoader  {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  getTranslation(lang: string): Observable<any>{
  	var apiAddress = env.apiUrl+'/api/translate?lang='+ lang;
    const storageKey = `translate_${lang.toUpperCase()}`;
    const cached = localStorage.getItem(storageKey);
    if (cached) {
      return of(JSON.parse(cached));
    }

    return this.http.get(apiAddress).pipe(
      map((res: any) => res[0]),
      tap((data) => {
        if (data) {
          localStorage.removeItem(storageKey);
          localStorage.setItem(storageKey, JSON.stringify(data));
        }
      })
    );
  }
}