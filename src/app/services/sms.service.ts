import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private http = inject(HttpClient);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() { }

  public smsIntegration(): any {
    return this.http.get(env.apiUrl + '/api/sms-integration');
  }

  public viewChars(item): any {
    return this.http.put(env.apiUrl + '/api/sms-view-chars/' + item.id, item);
  }

  public viewLogs(item): any {
    return this.http.get(env.apiUrl + '/api/sms-view-logs/' + item.id);
  }

  public getCompanies(): any {
    return this.http.get(env.apiUrl + '/api/sms-company');
  }

  public getUserAllClients(): any {
    return this.http.get(env.apiUrl + '/api/user-all-clients');
  }

  public getAllNik(operator, client_id): any {
    return this.http.get(env.apiUrl + '/api/all-nik?operator=' + operator + '&uid=' + client_id);
  }

  public getSmsBalance(id): any {
    return this.http.get(env.apiUrl + '/api/sms-check-balance/' + id);
  }

  public smsDetailsByDate(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling-by-date', data);
  }

  public smsDetailsByDateSumm(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling-by-date-summ', data);
  }

  public smsDetailsByDateCount(data) {
    return this.http.post(env.apiUrl + '/api/sms-detaling-by-date-count', data);
  }

  public smsDetailsByDateExport(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling-by-date-export', data, { responseType: 'blob' });
  }

  public getSmsMailingList(id, currentPage): any {
    var api = env.apiUrl + '/api/sms-details/' + id + '?page=' + currentPage;
    return this.http.get(api);
  }

  public getSmsDetails(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling/' + data.id, data);
  }

  public getSmsDetailsCount(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling-count/' + data.id, data);
  }

  public smsDetailsSumm(data): any {
    return this.http.post(env.apiUrl + '/api/sms-detaling-summ/' + data.id, data);
  }

  public getSmsDetailsDownload(id): any {
    return this.http.get(env.apiUrl + '/api/sms-detail-download/' + id, { responseType: 'arraybuffer' });
  }

  public detailByUser(id, year, month, region, archive) {
    var api = env.apiUrl + '/api/sms-user-statics/' + id + '?year=' + year + '&month=' + month + '&region=' + region;
    if (archive)
      api = env.apiUrl + '/api/sms-user-statics/' + id + '?year=' + year + '&month=' + month + '&region=' + region + '&archive=true';

    return this.http.get(api);
  }

  public checkAuth(id): any {
    return this.http.get(env.apiUrl + '/api/sms-check-auth/' + id);
  }

  public getSetting(id): any {
    return this.http.get(env.apiUrl + '/api/sms-get-setting/' + id);
  }

  public setAuth(data): any {
    return this.http.post(env.apiUrl + '/api/sms-set-auth', data);
  }

  public getSmsBalanceDetaling(id): any {
    return this.http.get(env.apiUrl + '/api/sms-balance-detail/' + id);
  }

  public requestContract(id): any {
    return this.http.get(env.apiUrl + '/api/sms-request-contract/' + id);
  }

  //Sms contacts
  public getSmsContact(data): any {
    return this.http.get(env.apiUrl + '/api/sms-contact?id=' + data.id + '&page=' + data.page + '&status=' + data.status);
  }
  public getSmsContactActive(id): any {
    return this.http.get(env.apiUrl + '/api/sms-contacts/' + id);
  }

  public updateSmsContact(data): any {
    return this.http.put(env.apiUrl + '/api/sms-contact/' + data.id, data);
  }

  public createSmsContact(data) {
    return this.http.post(env.apiUrl + '/api/sms-contact', data);
  }

  public deleteSmsContact(data) {
    return this.http.delete(env.apiUrl + '/api/sms-contact/' + data.id + '?client_id=' + data.client_id);
  }

  public getSmsContactById(id) {
    return this.http.get(env.apiUrl + '/api/sms-contact/' + id);
  }

  public exportContacts(data): any {
    return this.http.get(env.apiUrl + '/api/sms-export-contacts/' + data.id + '?group_id=' + data.group_id, { responseType: 'blob' });
  }

  public searchContact(search) {
    return this.http.post(env.apiUrl + '/api/sms-search-contact', search);
  }

  public deleteContactsMore(data) {
    return this.http.post(env.apiUrl + '/api/sms-contacts-delete', data);
  }

  public deleteContactsAll(id) {
    return this.http.get(env.apiUrl + '/api/sms-contacts-all-delete/' + id);
  }

  public searchContacts(data) {
    return this.http.post(env.apiUrl + '/api/sms-contacts-search', data);
  }

  //Sms groups
  public getSmsGroup(id): any {
    return this.http.get(env.apiUrl + '/api/sms-group?id=' + id);
  }

  public updateSmsGroup(data): any {
    return this.http.put(env.apiUrl + '/api/sms-group/' + data.id, data);
  }

  public createSmsGroup(data) {
    return this.http.post(env.apiUrl + '/api/sms-group', data);
  }

  public deleteSmsGroup(data) {
    return this.http.delete(env.apiUrl + '/api/sms-group/' + data.id);
  }

  public getSmsGroupById(id) {
    return this.http.get(env.apiUrl + '/api/sms-group/' + id);
  }

  public deleteSmsGroupAll() {
    return this.http.get(env.apiUrl + '/api/sms-group-all-delete');
  }

  //Sms templates
  public getSmsTemplate(): any {
    return this.http.get(env.apiUrl + '/api/sms-template');
  }

  public updateSmsTemplate(data): any {
    return this.http.put(env.apiUrl + '/api/sms-template/' + data.id, data);
  }

  public patchAnketa(data): any {
    return this.http.put(env.apiUrl + '/api/sms-patch-anketa/' + data.client_id, data);
  }

  public listAnketa(client_id): any {
    return this.http.get(env.apiUrl + '/api/sms-list-anketa/' + client_id);
  }

  public createSmsTemplate(data) {
    return this.http.post(env.apiUrl + '/api/sms-template', data);
  }

  public deleteSmsTemplate(data) {
    return this.http.delete(env.apiUrl + '/api/sms-template/' + data.id);
  }

  public deleteTemplateData(data) {
    return this.http.delete(env.apiUrl + '/api/sms-approve-template/' + data.id);
  }

  //Sms send  
  public smsSend(data) {
    return this.http.post(env.apiUrl + '/api/send-sms', data);
  }

  public smsSendGroup(data) {
    return this.http.post(env.apiUrl + '/api/send-sms/group', data);
  }

  public smsSendSingle(data) {
    return this.http.post(env.apiUrl + '/api/send-sms/single', data);
  }

  public smsSendGlobal(data) {
    return this.http.post(env.apiUrl + '/api/send-sms/global', data);
  }

  public deleteSchedule(data) {
    return this.http.post(env.apiUrl + '/api/sms-schedule', data);
  }

  //Sms tarrifs
  public countries() {
    return this.http.get(env.apiUrl + '/api/regions');
  }

  public getCountries(): any {
    return this.http.get(env.apiUrl + '/api/countries');
  }

  public getSmsTariffs(): any {
    var api = env.apiUrl + '/api/sms-tariff-list';
    return this.http.get(api);
  }

  //Sms templates  
  public getTemplates(client_id) {
    return this.http.get(env.apiUrl + '/api/sms-approve-template/id?client_id=' + client_id);
  }

  public addTemplate(data) {
    return this.http.post(env.apiUrl + '/api/sms-approve-template-add', data);
  }

  public editTemplate(data) {
    return this.http.put(env.apiUrl + '/api/sms-approve-template-update/' + data.id, data);
  }

  public getResellerTariff(): any {
    return this.http.get(env.apiUrl + '/api/tariff-reseller/0');
  }

  public addBalanceByBonus(data): any {
    return this.http.put(env.apiUrl + '/api/sms-client-balance-bonus/' + data.id, data);
  }

  public smsNikByClient(id): any {
    return this.http.get(env.apiUrl + '/api/sms-nick-by-client/' + id);
  }

  public connectSms(data): any {
    return this.http.post(env.apiUrl + '/api/sms-connect-test', data);
  }

  //Sms target
  public getSmsTargets(): any {
    return this.http.get(env.apiUrl + '/api/sms-target');
  }

  public getSmsTarget(id): any {
    return this.http.get(env.apiUrl + '/api/sms-target/' + id);
  }

  public createSmsTarget(data): any {
    return this.http.post(env.apiUrl + '/api/sms-target', data);
  }

  public updateSmsTarget(data): any {
    return this.http.put(env.apiUrl + '/api/sms-target/' + data.id, data);
  }

  public deleteSmsTarget(data): any {
    return this.http.delete(env.apiUrl + '/api/sms-target/' + data.id);
  }

  public exportSmsTarget(id): any {
    return this.http.get(env.apiUrl + '/api/sms-target-export/' + id, { responseType: 'blob' });
  }

  public getRegion(countryID): any {
    return this.http.get(env.apiUrl + '/api/region?country_id=' + countryID);
  }

  public globalSearch(data): any {
    return this.http.post(env.apiUrl + '/api/global-search-sms', data);
  }

  public reportTotalByMonth(data): any {
    return this.http.get(env.apiUrl + '/api/sms-report-total-by-month/' + data.client_id + '?year=' + data.year);
  }

  public reportTotalByOperator(data): any {
    return this.http.post(env.apiUrl + '/api/sms-report-total-by-operator/' + data.client_id, data);
  }

  public exportSms(data): any {
    return this.http.post(env.apiUrl + '/api/export-sms', data, { responseType: 'blob' });
  }

  public checkSmsMessage(data): any {
    return this.http.post(env.apiUrl + '/api/sms-check-messages/' + data.id, data);
  }

  public changeOwner(data): any {
    return this.http.post(env.apiUrl + '/api/sms-change-owner/' + data.id, data);
  }

  //Blacklist sms
  public getBlacklist(data) {
    return this.http.get(env.apiUrl + '/api/blacklist-sms-user?page=' + data.page + '&value=' + data.value + '&type=' + data.type);
  }

  public addBlacklist(data) {
    return this.http.post(env.apiUrl + '/api/blacklist-sms-user', data);
  }

  public deleteBlacklist(data) {
    return this.http.delete(env.apiUrl + '/api/blacklist-sms/' + data.id + '?client_id=' + data.client_id);
  }

  public monthlyDept(data): any {
    return this.http.get(env.apiUrl + '/api/sms-monthly-dept/' + data.client_id + '?year=' + data.year);
  }

  public smsUndeliveredPhones(data): any {
    return this.http.post(env.apiUrl + '/api/sms-undelivered-phones', data);
  }


}

