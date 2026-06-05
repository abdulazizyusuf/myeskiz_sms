import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);

  constructor(...args: unknown[]);

  constructor() { }

  public getDataItems(): any {
    return this.http.get(env.apiUrl + '/api/employee');
  }

  public getData(id): any {
    return this.http.get(env.apiUrl + '/api/employee/' + id);
  }

  public createData(data: any): any {
    return this.http.post(env.apiUrl + '/api/employee', data);
  }

  public updateData(data: any) {
    return this.http.put(env.apiUrl + '/api/employee/' + data.id, data);
  }

  public deleteData(data: any) {
    return this.http.delete(env.apiUrl + '/api/employee/' + data.id);
  }

  //Logs
  public logs(data): any {
    return this.http.post(env.apiUrl + '/api/sms-logs-list', data);
  }

}  