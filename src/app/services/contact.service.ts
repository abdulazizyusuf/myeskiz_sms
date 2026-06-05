import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  public allContacts(): any {
    return this.http.get(env.apiUrl + '/api/all-contact');
  }

  public searchContactApi(data: any): any {
    return this.http.post(env.apiUrl + '/api/search-contact-api', data);
  }

  public searchContact(search: any) {
    return this.http.post(env.apiUrl + '/api/search-contact', search);
  }

}  