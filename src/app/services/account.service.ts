import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { catchError, mapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  public getUsers(data): any {
    return this.http.get(env.apiUrl + '/api/user?page=' + data.page + '&role=' + data.role + '&option=' + data.option + '&val=' + data.val + '&date_from=' + data.date_from + '&date_to=' + data.date_to);
  }

  public getUserId(id: any) {
    return this.http.get(env.apiUrl + '/api/user/' + id);
  }

  public getUser() {
    return this.http.get(env.apiUrl + '/api/user/id');
  }

  public logout() {
    return this.http.get(env.apiUrl + '/api/auth/logout');
  }

  public getAllResellers(data: any): any {
    return this.http.get(env.apiUrl + '/api/all-resellers?page=' + data.page + '&option=' + data.option + '&val=' + data.val + '&date_from=' + data.date_from + '&date_to=' + data.date_to + '&tariff_id=' + data.tariff_id);
  }

  public getResellersSms() {
    return this.http.get(env.apiUrl + '/api/user-reseller-sms');
  }

  public searchUser(data: any) {
    return this.http.post(env.apiUrl + '/api/search-user', data);
  }

  public detailUser(id: any): any {
    return this.http.get(env.apiUrl + '/api/detail-user/' + id);
  }

  public updateUser(user: any): any {
    return this.http.put(env.apiUrl + '/api/user/' + user.id, user);
  }

  public updateUserLang(user: any): any {
    return this.http.post(env.apiUrl + '/api/user-lang', user);
  }

  public createUser(user: any): any {
    return this.http.post(env.apiUrl + '/api/user', user);
  }

  public deleteUser(user: any): any {
    return this.http.delete(env.apiUrl + '/api/user/' + user.id);
  }

  public changePassword(user: any): any {
    return this.http.post(env.apiUrl + '/api/user/change-password', user);
  }

  public confirmUser(code: any): any {
    return this.http.post(env.apiUrl + '/api/user/activate', code);
  }

  public getEmail(email: any): any {
    return this.http.get(env.apiUrl + '/api/check/user?email=' + email);
  }

  public getPhone(phone: any): any {
    return this.http.get(env.apiUrl + '/api/check/user?phone=' + phone);
  }

  public loginByUser(data: any): any {
    return this.http.post(env.apiUrl + '/api/login-by-user', data);
  }

  public resetPassword(data: any): any {
    return this.http.post(env.apiUrl + '/api/auth/reset-password', data);
  }

  public smsSignup(data: any): any {
    return this.http.post(env.apiUrl + '/api/auth/sms-signup', data);
  }

  public checkVoucher(data: any): any {
    return this.http.post(env.apiUrl + '/api/voucher-check-code', data);
  }

  public addBalanceUser(data: any): any {
    return this.http.put(env.apiUrl + '/api/user-add-balance/' + data.id, data);
  }

  public listBalanceUser(id: any): any {
    return this.http.get(env.apiUrl + '/api/user-list-balance/' + id);
  }

  public updateBalanceUser(data: any): any {
    return this.http.put(env.apiUrl + '/api/user-update-balance/' + data.id, data);
  }

  public deleteBalanceUser(id: any): any {
    return this.http.get(env.apiUrl + '/api/user-delete-balance/' + id);
  }

  public noteUser(data: any): any {
    return this.http.put(env.apiUrl + '/api/note-user/' + data.id, data);
  }

  public favoriteUser(data: any): any {
    return this.http.put(env.apiUrl + '/api/favorite-user/' + data.id, data);
  }

  public favoriteUsers(data: any): any {
    return this.http.get(env.apiUrl + '/api/favorite-users?page=' + data.page);
  }

  public smsSendAgain(id: any): any {
    return this.http.get(env.apiUrl + '/api/sms-send-again/' + id);
  }

  public balanceEdit(data: any): any {
    return this.http.put(env.apiUrl + '/api/users-edit-balance/' + data.id, data);
  }

  public getBalance(id: any): any {
    return this.http.get(env.apiUrl + '/api/users-detail-balance/' + id);
  }

  public apiContactDetail(data: any): any {
    data.api_key = 'ajBjDhCWPXzOUmHMiDbs3PQBLkJHZjRhz3mKnlk';
    return this.http.post(env.apiUrl + '/api/api-contact-detail', { request_data: btoa(unescape(encodeURIComponent(JSON.stringify(data)))) });
  }

}  