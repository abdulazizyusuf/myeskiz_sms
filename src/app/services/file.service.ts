import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor () {}

  public deleteFile(hash):any {
    return this.http.post(env.apiUrl+'/api/file-delete', {file:hash});
  }

  public deleteTicketFile(filename):any {
    return this.http.post(env.apiUrl+'/api/ticket-file', {file:filename, type:'ticket'});
  }

  public deleteTaskFile(filename):any {
    return this.http.post(env.apiUrl+'/api/ticket-file', {file:filename, type:'task'});
  }

  public deleteOther(filename, type):any {
    return this.http.post(env.apiUrl+'/api/delete-other', {file:filename, type:type});
  }

}  