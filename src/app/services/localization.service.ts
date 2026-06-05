import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  public getLocals(data: any): any {
    return this.http.get(env.apiUrl + '/api/localization?page=' + data.page + '&title=' + data.title);
  }

  public updateLocal(data: any): any {
    return this.http.put(env.apiUrl + '/api/localization/' + data.id, data);
  }

  public createLocal(data: any): any {
    return this.http.post(env.apiUrl + '/api/localization', data);
  }

  public deleteLocal(data: any): any {
    return this.http.delete(env.apiUrl + '/api/localization/' + data.id);
  }

  public getLocal(id: any): any {
    return this.http.get(env.apiUrl + '/api/localization/' + id);
  }

}  