import { Component, OnInit, Input, forwardRef, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { DatePipe, NgStyle, NgClass, DecimalPipe, LowerCasePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal, NgbDatepickerConfig, NgbPopover, NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, NgbInputDatepicker, NgbNavOutlet, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, NgbTooltip, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { env } from '../../../environments/environment';
import { SmsService } from '../../services/sms.service';
import { UploadService } from '../../services/upload.service';
import { FileService } from '../../services/file.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FileSaverService } from 'ngx-filesaver';
import { ContactService } from '../../services/contact.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FilterPipe, TotalPipe, TimePipe, SmsCountPipe, LogTimePipe, SearchPipe, SafePipe } from '../../directive/filter';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxSelectModule } from 'ngx-select-ex';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-sms',
  templateUrl: './sms-message.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgStyle, NgbPopover, RouterLink, NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, FormsModule, NgbInputDatepicker, TranslateModule, NgxSelectModule, NgxMaskDirective, NgbNavOutlet, NgClass, DecimalPipe, FilterPipe]
})
export class SmsComponent implements OnInit {

  countries = signal<any[]>([]);
  curLang: any;
  search: any;
  clients = signal<any[]>([]);
  times: any;
  templates = signal<any[]>([]);
  groupsData = signal<any[]>([]);
  contactsData = signal<any[]>([]);
  contacts = signal<any[]>([]);
  messageSingle: any;
  messageGlobal: any;
  message: any;
  messageGroup: any;
  templateData: any;
  templateDataGroup: any;
  templateDataSingle: any;
  templateDataGlobal: any;
  currentUser: any;
  userBalance = signal<any>({});
  currentCompany: any;
  currentClientId: any;
  regions = signal<any[]>([]);
  cities = signal<any[]>([]);
  dataNik = signal<any[]>([]);
  choose_contact: boolean;
  choose_contacts: boolean;
  change_contact: boolean;
  not_found: boolean;
  sendSuccess = signal<boolean>(false);
  sendSuccessScheduled = signal<boolean>(false);
  login_failed: boolean;
  user_blocked: boolean;
  smsWaitLoading = signal<boolean>(false);
  loading: boolean;
  balace_not_enough: string;
  limit_contact_send_sms: string;
  resultMessage: string;
  sms_illegal_found_word: string;
  service_suspended_msg: string;
  smsLength: number = 0;
  smsLengthGroup: number = 0;
  smsLengthSingle: number = 0;
  smsLengthGlobal: number = 0;
  smsCount: number = 0;
  smsCountGroup: number = 0;
  smsCountSingle: number = 0;
  smsCountGlobal: number = 0;
  smsCountLimit: boolean;
  contactsCount: number = 0;
  clientPrice: number = 0;
  smsInfo: boolean;
  is_sms_access: boolean;
  sendData: any;
  successfully_connect_sms: string;
  sms_limited_access_send: string;
  sms_required_deal_contract: string;
  sms_balans_indebted: string;
  sms_test_waiting_alert_msg: string;
  number_is_blacklist_msg: string;
  sms_sent_only_test_template_msg: string;
  inquiry_contract_msg: string;
  operator: string;
  is_admin: boolean;
  blacklist_keywords: any;
  alertShowRequestContract: boolean;
  changeOwnerAccess: boolean;
  is_type_sent: boolean;
  is_detailing: boolean;

  constructor(
    private Sms: SmsService,
    private Contact: ContactService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private config: NgbDatepickerConfig,
  ) {
    var d = new Date();
    config.minDate = { year: d.getFullYear(), month: (d.getMonth() + 1), day: d.getDate() };
  }

  ngOnInit() {
    this.dataNik.set([]);
    this.operator = '';
    this.is_sms_access = false;
    this.is_type_sent = false;
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.translate.get(['balace_not_enough', 'limit_contact_send_sms', 'sms_illegal_found_word', 'successfully_connect_sms', 'sms_limited_access_send', 'sms_balans_indebted', 'required_deal_contract', 'sms_test_waiting_alert_msg', 'number_is_blacklist', 'sms_sent_only_test_template', 'Ваш запрос успешно выполнен!']).subscribe((item: any) => {
      this.balace_not_enough = item['balace_not_enough'];
      this.limit_contact_send_sms = item['limit_contact_send_sms'];
      this.sms_illegal_found_word = item['sms_illegal_found_word'];
      this.successfully_connect_sms = item['successfully_connect_sms'];
      this.sms_limited_access_send = item['sms_limited_access_send'];
      this.sms_required_deal_contract = item['required_deal_contract'];
      this.sms_balans_indebted = item['sms_balans_indebted'];
      this.sms_test_waiting_alert_msg = item['sms_test_waiting_alert_msg'];
      this.number_is_blacklist_msg = item['number_is_blacklist'];
      this.sms_sent_only_test_template_msg = item['sms_sent_only_test_template'];
      this.inquiry_contract_msg = item['Ваш запрос успешно выполнен!'];
    });
    if (this.currentUser.role == 'admin' || this.currentUser.role == 'leader' || this.currentUser.role == 'manager') {
      this.is_admin = true;
      this.is_sms_access = true;
    }
    if (this.currentUser.role == 'admin' || this.currentUser.email == 'qodirjon@eskiz.uz' || this.currentUser.email == 'zulfiya@eskiz.uz')
      this.is_type_sent = true;

    this.is_detailing = true;
    if (this.currentUser.role == 'employee' && this.currentUser.detailing)
      this.is_detailing = false;

    this.sendData = { contact_id: '', info: '' }
    this.times = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    this.templateData = '';
    this.templateDataGroup = '';
    this.templateDataSingle = '';
    this.messageSingle = {
      sending: 'server1',
      phone: '',
      text: '',
      nik_id: '',
      count: 1,
    }
    this.messageGlobal = {
      phone: '',
      dial_code: '',
      text: '',
      country_code: '',
      price: '',
      count: 1,
    }
    this.message = {
      contacts: [],
      text: '',
      name: '',
      type: 'instant',
      date: '',
      time: '09:00',
      nik_id: '',
      count: 1,
    }
    this.messageGroup = {
      groups: [],
      text: '',
      name: '',
      type: 'instant',
      date: '',
      time: '09:00',
      nik_id: '',
      count: 1,
    }

    if (this.currentUser.role == 'admin') {
      this.Sms.getSmsTariffs().subscribe((res: any) => {
        if (res)
          this.countries.set(res);
      })
    }

    if (this.currentUser.role == 'admin' || this.currentUser.role == 'leader' || this.currentUser.role == 'manager')
      this.messageGroup.server = 'server1';

    if (this.currentUser.role != 'student') {
      this.spinner.show();
      this.getClients();
    } else {
      this.login_failed = true;
      this.user_blocked = false;
      this.is_sms_access = true;
    }
  }

  getClients() {
    this.Sms.getUserAllClients().subscribe(res => {
      this.clients.set(res);
      if (this.clients() && this.clients().length > 0) {
        if (localStorage.getItem('sms_info')) {
          if (this.clients()[0].status != 'active')
            this.smsInfo = true;
          else {
            this.smsInfo = false;
            localStorage.removeItem('sms_info');
          }
        }
        if (this.clients().length > 1) {
          this.spinner.hide();

          if (!localStorage.getItem('currentClient') && !localStorage.getItem('currentCompany'))
            this.choose_contact = true;

          if (localStorage.getItem('currentClient') && localStorage.getItem('currentClient') == 'undefined' && !localStorage.getItem('currentCompany'))
            this.choose_contact = true;

          if (localStorage.getItem('currentClient') && localStorage.getItem('currentClient') != 'undefined' && localStorage.getItem('currentCompany'))
            this.getSmsData(localStorage.getItem('currentCompany'));
        }
        if (this.clients().length == 1) {
          this.getSmsData(this.clients()[0].id)
          this.checkAuth(this.clients()[0].id);
        }
      } else {
        this.spinner.hide();
        this.login_failed = true;
        this.user_blocked = false;
        this.is_sms_access = true;
      }
    })
  }

  closeSmsInfo() {
    this.smsInfo = false;
    localStorage.removeItem('sms_info');
  }

  changeCountry(event) {
    this.countries().forEach((item: any) => {
      if (item.code == event) {
        this.messageGlobal.price = item.price;
        this.messageGlobal.dial_code = item.prefix;
      }
    })
  }

  getSmsData(id) {
    this.search = {
      id: id,
      age: '',
      gender: '',
      ctatus: '',
      region: '',
      city: '',
      dob: '',
    }
    localStorage.setItem('currentCompany', id);
    this.clients().forEach((item: any) => {
      if (item.id == id) {
        this.is_sms_access = true;
        this.currentCompany = item;
        this.currentClientId = item.id;
        this.currentCompany.prices.forEach((item: any) => {
          if (item && item.smsc_id == 2) {
            //this.currentCompany.price = item.price;
            this.currentCompany.price = 200;
          }
        })
        localStorage.setItem('currentClient', JSON.stringify(this.currentCompany));
        this.checkAuth(item.id);
        this.getAllNik();
      }
    })

    this.Sms.getSmsGroup(localStorage.getItem('currentCompany')).subscribe(res => {
      if (res) {
        this.groupsData.set([]);
        res.forEach((item: any) => {
          this.groupsData.update((groupsData) => [...groupsData, { id: item.id, name: item.title, count: item.contact_count, title: item.title + ' (' + item.contact_count + ')' }])
        })
      }
    })
    this.Sms.getSmsTemplate().subscribe(res => {
      this.templates.set(res);
    })

    if (this.currentCompany && this.currentCompany.option_contact == 'yes')
      this.getRegions();
  }

  changeOperator() {
    this.spinner.show();
    this.getAllNik();
  }

  getAllNik() {
    this.Sms.getAllNik(this.operator, this.currentCompany.id).subscribe(res => {
      if (res) {
        this.spinner.hide();
        this.dataNik.set(res);
      }
    })
  }

  getRegions() {
    this.Sms.countries().subscribe((res: any) => {
      this.regions.set(res.regions);
    })
  }

  getCities(name) {
    this.cities.set([]);
    this.search.city = '';
    this.regions().forEach((item: any) => {
      if (item.name == name)
        this.cities.set(item.cities);
    })
  }

  searchContact() {
    this.loading = true;
    this.resultMessage = '';
    this.Sms.searchContacts(this.search).subscribe((res: any) => {
      this.loading = false;
      this.resultMessage = res.message;
      this.message.contacts = res.result;
    })
  }

  sendAgain() {
    this.resultMessage = '';
    this.sendSuccess.set(false);
    this.sendSuccessScheduled.set(false);
    this.message = {
      contacts: [],
      text: '',
      name: '',
      type: 'instant',
      date: '',
      time: '09:00',
    }
    this.messageGroup = {
      groups: [],
      text: '',
      name: '',
      type: 'instant',
      date: '',
      time: '09:00',
    }
  }

  openAlerPopup() {
    this.choose_contact = true;
  }

  openRequestContract() {
    this.alertShowRequestContract = true;
  }

  closeAlerPopup() {
    this.choose_contact = false;
    this.alertShowRequestContract = false;
    this.change_contact = false;
  }

  saveClient(id: any) {
    this.spinner.show();
    this.getSmsData(id);
    this.closeAlerPopup();
  }

  onDateSelectionMessage(date: any) {
    this.message.dates = this.getDateFormat(date);
  }

  onDateSelectionMessageGroup(date: any) {
    this.messageGroup.dates = this.getDateFormat(date);
  }

  getDateFormat(date: any) {
    if (date) {
      var year = date.year;
      var month = date.month;
      var day = date.day;
      if (date.month < 10)
        month = "0" + month;
      if (date.day < 10)
        day = "0" + day;

      return day + '.' + month + '.' + year;
    }
  }

  messageSingleText(event: any) {
    this.smsCountSingle = Number(this.messageCalcCount(event));
    this.smsLengthSingle = event.length;
  }

  messageGlobalText(event: any) {
    this.smsCountGlobal = Number(this.messageCalcCount(event));
    this.smsLengthGlobal = event.length;
  }

  messageText(event: any) {
    this.smsCount = Number(this.messageCalcCount(event));
    this.smsLength = event.length;
  }

  messageGroupText(event: any) {
    this.smsCountGroup = Number(this.messageCalcCount(event));
    this.smsLengthGroup = event.length;
  }

  calcCharacter(text: any, type: any) {
    if (text) {
      this.Sms.checkSmsMessage({ text: text, id: this.currentCompany.api_user_id }).subscribe((res: any) => {
        if (res.data) {
          if (type == 'global') {
            this.smsLengthGlobal = res.data.chars_count;
            this.smsCountGlobal = res.data.parts_count;
          }
          if (type == 'group') {
            this.smsLengthGroup = res.data.chars_count;
            this.smsCountGroup = res.data.parts_count;
          }
          if (type == 'contact') {
            this.smsLength = res.data.chars_count;
            this.smsCount = res.data.parts_count;
          }
          if (type == 'single') {
            this.smsLengthSingle = res.data.chars_count;
            this.smsCountSingle = res.data.parts_count;
          }
        }
      })
    }
  }

  messageCalcCount(event: any) {
    var regexp = new RegExp("^[A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘ\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!\"#$%&'()*+,\\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]*$");
    var isGsm = regexp.test(event);

    var smsCount;
    this.smsCountLimit = false;

    if (!isGsm) {
      if (event.length <= 70)
        smsCount = 1;
      else if (event.length <= 134)
        smsCount = 2;
      else if (event.length <= 201)
        smsCount = 3;
      else if (event.length <= 268)
        smsCount = 4;
      else if (event.length <= 335)
        smsCount = 5;
      else if (event.length <= 402)
        smsCount = 6;
      else if (event.length <= 469)
        smsCount = 7;
      else if (event.length <= 536)
        smsCount = 8;
      else
        this.smsCountLimit = true;
    }

    if (isGsm) {
      if (event.length <= 160)
        smsCount = 1;
      else if (event.length <= 306)
        smsCount = 2;
      else if (event.length <= 459)
        smsCount = 3;
      else if (event.length <= 612)
        smsCount = 4;
      else if (event.length <= 765)
        smsCount = 5;
      else if (event.length <= 918)
        smsCount = 6;
      else if (event.length <= 1071)
        smsCount = 7;
      else if (event.length <= 1224)
        smsCount = 8;
      else
        this.smsCountLimit = true;
    }

    if (event == '')
      smsCount = 0;

    return smsCount;
  }

  getSmsBalance() {
    this.Sms.getSmsBalance(localStorage.getItem('currentCompany')).subscribe((data: any) => {
      if (data && data.status == 'success')
        this.userBalance.set(data);
    }, error => {
      this.toastr.error(error.error.message);
    })
  }

  templateChooseSingle(id: any) {
    var template = this.templates().filter((item: any) => {
      if (item.id == id)
        return item;
    });
    if (template && template.length > 0)
      this.messageSingle.text = template[0].text;
    else
      this.messageSingle.text = '';

    this.messageSingleText(this.messageSingle.text);
  }

  templateChooseGlobal(id: any) {
    var template = this.templates().filter((item: any) => {
      if (item.id == id)
        return item;
    });
    if (template && template.length > 0)
      this.messageGlobal.text = template[0].text;
    else
      this.messageGlobal.text = '';

    this.messageGlobalText(this.messageGlobal.text);
  }

  templateChoose(id: any) {
    var template = this.templates().filter((item: any) => {
      if (item.id == id)
        return item;
    });
    if (template && template.length > 0)
      this.message.text = template[0].text;
    else
      this.message.text = '';

    this.messageText(this.message.text);
  }

  templateChooseGroup(id: any) {
    var template = this.templates().filter((item: any) => {
      if (item.id == id)
        return item;
    });
    if (template && template.length > 0)
      this.messageGroup.text = template[0].text;
    else
      this.messageGroup.text = '';

    this.messageGroupText(this.messageGroup.text);
  }

  checkAuth(id: any) {
    this.Sms.checkAuth(id).subscribe((res: any) => {
      this.spinner.hide();
      this.is_sms_access = true;
      this.service_suspended_msg = '';
      if (this.currentCompany.contact_type == 'p' && this.currentCompany.type == 'test' && (this.currentCompany.status == 'active' || this.currentCompany.status == 'indebted'))
        this.getAllContacts();

      if (res.status == 'not-found' || res.status == 'login_failed') {
        this.login_failed = true;
        this.getAllContacts();
      }

      if (res.status == 'user_blocked') {
        this.user_blocked = true;
        this.getAllContacts();
      }

      if (res.status == 'not_available') {
        this.login_failed = true;
        this.service_suspended_msg = res.message;
      }

      if (res.status == 'success') {
        //this.getSmsContactData(id);
        this.login_failed = false;
        this.getSmsBalance();
      }
    }, error => {
      this.spinner.hide();
    })
  }

  getAllContacts() {
    if (this.currentUser.role == 'user' || this.currentUser.role == 'reseller') {
      this.changeOwnerAccess = false;
      this.Contact.allContacts().subscribe((res: any) => {
        this.contacts.set(res);
        this.contacts().forEach((item: any) => {
          if (item.type == 'l' && item.status == 'approved')
            this.changeOwnerAccess = true;
        })
      });
    }
  }

  getSmsContactData(id: any) {
    this.Sms.getSmsContactActive(id).subscribe(data => {
      if (data) {
        this.spinner.hide();
        this.contactsData.set(data);
      }
    })
  }

  sendSms() {
    this.blacklist_keywords = [];
    this.smsWaitLoading.set(true);
    if (this.message.date)
      this.message.scheduled_date = this.message.dates + ' ' + this.message.time;

    var currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.message.client_id = localStorage.getItem('currentCompany');
    this.message.count = this.smsCount;
    this.message.price = currentClient.price;
    this.Sms.smsSend(this.message).subscribe((res: any) => {
      this.smsWaitLoading.set(false);
      if (res.status == 'success') {
        this.sendSuccess.set(true);
        this.sendSuccessScheduled.set(false);
        if (this.message.type == 'scheduled')
          this.sendSuccessScheduled.set(true);
        this.getSmsBalance();
      }
      if (res.status == 'not-send') {
        if (currentClient && currentClient.type == 'client')
          this.toastr.error('СМС сообщении не было отправленно');
        if (currentClient && currentClient.type == 'test')
          this.toastr.error(this.sms_required_deal_contract);
        //window.location.href = '/sms';
      }
      if (res.status == 'not-balance')
        this.toastr.error(this.balace_not_enough);
      if (res.status == 'indebted')
        this.toastr.error(this.sms_balans_indebted);
      if (res.status == 'limit')
        this.toastr.error(this.limit_contact_send_sms);
      if (res.status == 'blacklist') {
        this.toastr.error(this.sms_illegal_found_word);
        this.blacklist_keywords = res.result;
      }
      if (res.status == 'access_sms_send')
        this.toastr.error(res.message[this.curLang]);
    }, error => {
      this.smsWaitLoading.set(false);
      this.toastr.error(error.error.message);
    })
  }

  sendSmsGroup() {
    this.blacklist_keywords = [];
    this.smsWaitLoading.set(true);
    if (this.messageGroup.date)
      this.messageGroup.scheduled_date = this.messageGroup.dates + ' ' + this.messageGroup.time;

    var currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.messageGroup.client_id = localStorage.getItem('currentCompany');
    this.messageGroup.count = this.smsCountGroup;
    this.messageGroup.price = currentClient.price;
    this.Sms.smsSendGroup(this.messageGroup).subscribe((res: any) => {
      this.smsWaitLoading.set(false);
      if (res.status == 'success') {
        this.sendSuccess.set(true);
        this.sendSuccessScheduled.set(false);
        if (this.messageGroup.type == 'scheduled')
          this.sendSuccessScheduled.set(true);
        this.getSmsBalance();
      }
      if (res.status == 'not-send') {
        if (currentClient && currentClient.type == 'client')
          this.toastr.error('СМС сообщении не было отправленно');
        if (currentClient && currentClient.type == 'test')
          this.toastr.error(this.sms_required_deal_contract);
        //window.location.href = '/sms';
      }
      if (res.status == 'not-balance')
        this.toastr.error(this.balace_not_enough);
      if (res.status == 'limit')
        this.toastr.error(this.limit_contact_send_sms);
      if (res.status == 'blacklist') {
        this.toastr.error(this.sms_illegal_found_word);
        this.blacklist_keywords = res.result;
      }
      if (res.status == 'access_sms_send')
        this.toastr.error(res.message[this.curLang]);
      if (res.status == 'indebted')
        this.toastr.error(this.sms_balans_indebted);
    }, error => {
      this.smsWaitLoading.set(false);
      this.toastr.error(error.error.message);
    })
  }

  sendSmsSingle() {
    this.blacklist_keywords = [];
    var currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.smsWaitLoading.set(true);
    this.messageSingle.client_id = localStorage.getItem('currentCompany');
    this.messageSingle.count = this.smsCountSingle;
    this.Sms.smsSendSingle(this.messageSingle).subscribe((res: any) => {
      this.smsWaitLoading.set(false);
      if (res.status == 'success') {
        this.sendSuccess.set(true);
        this.sendSuccessScheduled.set(false);
        this.getSmsBalance();
      }
      if (res.status == 'not-send') {
        if (currentClient && currentClient.type == 'client')
          this.toastr.error('СМС сообщении не было отправленно');
        if (currentClient && currentClient.type == 'test')
          this.toastr.error(this.sms_sent_only_test_template_msg);
      }
      if (res.status == 'not-balance')
        this.toastr.error(this.balace_not_enough);
      if (res.status == 'limit')
        this.toastr.error(this.limit_contact_send_sms);
      if (res.status == 'blacklist') {
        this.toastr.error(this.sms_illegal_found_word);
        this.blacklist_keywords = res.result;
      }
      if (res.status == 'access_sms_send')
        this.toastr.error(res.message[this.curLang]);
      if (res.status == 'blacklist-phone')
        this.toastr.error(this.number_is_blacklist_msg);
      if (res.status == 'indebted')
        this.toastr.error(this.sms_balans_indebted);
    }, error => {
      this.smsWaitLoading.set(false);
      this.toastr.error(error.error.message);
    })
  }

  sendSmsGlobal() {
    this.blacklist_keywords = [];
    this.smsWaitLoading.set(true);
    this.messageGlobal.client_id = localStorage.getItem('currentCompany');
    this.messageGlobal.count = this.smsCountGlobal;
    this.Sms.smsSendGlobal(this.messageGlobal).subscribe((res: any) => {
      this.smsWaitLoading.set(false);
      if (res.status == 'success') {
        this.sendSuccess.set(true);
        this.sendSuccessScheduled.set(false);
        this.getSmsBalance();
      }
      if (res.status == 'not-send') {
        this.toastr.error('СМС сообщении не было отправленно');
        //window.location.href = '/sms';
      }
      if (res.status == 'not-balance')
        this.toastr.error(this.balace_not_enough);
      if (res.status == 'limit')
        this.toastr.error(this.limit_contact_send_sms);
      if (res.status == 'blacklist') {
        this.toastr.error(this.sms_illegal_found_word);
        this.blacklist_keywords = res.result;
      }
      if (res.status == 'indebted')
        this.toastr.error(this.sms_balans_indebted);
    }, error => {
      this.smsWaitLoading.set(false);
      this.toastr.error(error.error.message);
    })
  }

  getActiveTab(event) {
    //if(event.nextId == 'tab-messages-group')
    this.smsCountLimit = false;
  }

  addBalance() {
    var currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.balanceData = { id: currentClient.id, balance: '' };
    modalRef.componentInstance.balance_bonus = true;
  }

  connectSms() {
    this.getAllContacts();
    this.choose_contacts = true;
  }

  closeAlert() {
    this.choose_contacts = false;
    this.change_contact = false;
  }

  connectSmsService() {
    if (this.sendData.info && this.sendData.contact_id) {
      this.spinner.show();
      this.Sms.connectSms(this.sendData).subscribe((res: any) => {
        if (res.status == 'success') {
          localStorage.setItem('sms_info', 'yes');
          this.spinner.hide();
          this.toastr.success(this.successfully_connect_sms);
          this.closeAlert();
          this.getClients();
        }
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      })
    } else
      this.toastr.error('Заполните все необходимые поля');
  }

  requestContract() {
    this.spinner.show();
    this.Sms.requestContract(this.currentCompany.id).subscribe((res: any) => {
      if (res.status == 'success') {
        this.spinner.hide();
        this.toastr.success(this.inquiry_contract_msg);
        this.currentCompany.contract_status = 1;
        this.closeAlerPopup();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  changesGroups(items: any) {
    this.contactsCount = 0;
    items.forEach((item: any) => {
      this.groupsData().forEach((group: any) => {
        if (item.value == group.id)
          this.contactsCount += group.count;
      })
    })
  }

  changeOwner() {
    this.change_contact = true;
  }

  changeOwnerPatch() {
    this.spinner.show();
    this.Sms.changeOwner({ id: this.sendData.contact_id, client_id: this.currentCompany.id }).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.currentCompany.contact_type = 'l';
        this.getSmsData(this.currentCompany.id);
        this.closeAlerPopup();
      } else
        this.toastr.error(res.message);
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

}

//Sms detaling
@Component({
  selector: 'app-sms-detailing',
  templateUrl: './sms-detailing.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, RouterLink, NgbTooltip, NgbPagination, FormsModule, NgbInputDatepicker, NgxMaskDirective, TranslateModule, NgbNavOutlet, NgClass, LowerCasePipe, DecimalPipe, DatePipe, FilterPipe, TotalPipe, TimePipe, SmsCountPipe, LogTimePipe]
})
export class SmsDetailingComponent implements OnInit {

  datePipe = new DatePipe("en-US");
  siteUrl: string;
  mailingList = signal<any[]>([]);
  messagesData = signal<any[]>([]);
  historyBalance = signal<any[]>([]);
  filter: any;
  filterCount: any;
  currentUser: any;
  filterStatus: any;
  smsData: any;
  not_found: boolean;
  not_found_data = signal<boolean>(false);
  login_failed: boolean;
  user_blocked: boolean;
  alertSms: boolean;
  alertExport: boolean;
  status_rejected: string;
  status_expired: string;
  status_waiting: string;
  status_delivered: string;
  status_not_delivered: string;
  status_failed: string;
  status_scheduled: string;
  status_finished: string;
  status_sent: string;
  status_system_waiting: string;
  dispatch_time: string;
  statics: any;
  stWaiC = signal<any>(0);
  stTRSC = signal<any>(0);
  stDelC = signal<any>(0);
  stNotDelC = signal<any>(0);
  stFailC = signal<any>(0);
  stSchedC = signal<any>(0);
  stRejC = signal<any>(0);
  stExpC = signal<any>(0);
  months: any;
  companies = signal<any[]>([]);
  pager: any = {};
  pagedItems: any;
  filterYear: number;
  years: any;
  loader: boolean;
  currentClient: any;
  archiveDetail: boolean;
  smsDetailLink: string;
  totalPage: any;
  currentPage: any;
  totalPageByDate: number = 0;
  currentPageByDate: number = 0;
  pageSizeByDate: number = 0;
  totalCount: number = 0;
  historyBalanceTotal: number = 0;
  payments_type: any;
  countries: any;
  is_history: boolean;
  search: any;
  allClients = signal<any[]>([]);
  globalData = signal<any[]>([]);
  pageSize: number = 20;
  is_admin: boolean;
  reportByMonth = signal<any[]>([]);
  reportByOperator = signal<any[]>([]);
  total_sum_date = signal<any>({});
  exportData: any;
  curLang: any;
  success_deleted_msg: any;
  is_detailing: boolean;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fileSaver: FileSaverService,
  ) {
    this.router.events.subscribe((e: any) => {
      this.archiveDetail = false;
      this.smsDetailLink = '/sms/detailing/';
      this.route.params.subscribe((data: any) => {
        if (data.slug && data.slug == 'archive') {
          this.archiveDetail = true;
          this.smsDetailLink = '/sms/detail/archive/';
        }
      })
    })
  }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
    this.curLang = localStorage.getItem('curLang') || 'ru';
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    if (this.currentUser.role == 'admin' || this.currentUser.role == 'leader' || this.currentUser.role == 'manager')
      this.is_admin = true;

    this.is_detailing = true;
    if (this.currentUser.role == 'employee' && this.currentUser.detailing)
      this.is_detailing = false;

    this.countries = JSON.parse(localStorage.getItem('countries') || '[]');
    this.translate.get(['sms_status_rejected', 'sms_status_waiting', 'sms_status_delivered', 'sms_status_notdelivered', 'sms_status_failed', 'sms_status_expired', 'scheduled', 'january', 'february', 'march', 'april', 'may', 'juny', 'july', 'august', 'september', 'october', 'november', 'december', 'in_year', 'status_finished', 'sent', 'dispatch_time', 'waiting', 'Перечисление', 'Наличные', 'Долг', 'Бесплатно', 'recal', 'Пополнено из Кешбека', 'balance_minus', 'Снять с баланса за ник', 'Для теста', 'Перекидка из баланса пользователя', 'Списано с баланса за ник', 'Успешно удалено', 'Списано деньги из баланса']).subscribe((item: any) => {
      this.status_rejected = item['sms_status_notdelivered'];
      this.status_waiting = item['sms_status_waiting'];
      this.status_delivered = item['sms_status_delivered'];
      this.status_not_delivered = item['sms_status_notdelivered'];
      this.status_failed = item['sms_status_failed'];
      this.status_expired = item['sms_status_expired'];
      this.status_scheduled = item['scheduled'];
      this.status_finished = item['status_finished'];
      this.status_sent = item['sent'];
      this.dispatch_time = item['dispatch_time'];
      this.status_system_waiting = item['waiting'];
      this.success_deleted_msg = item['Успешно удалено'];

      this.years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

      this.months = [
        { val: 1, title: item['january'] },
        { val: 2, title: item['february'] },
        { val: 3, title: item['march'] },
        { val: 4, title: item['april'] },
        { val: 5, title: item['may'] },
        { val: 6, title: item['juny'] },
        { val: 7, title: item['july'] },
        { val: 8, title: item['august'] },
        { val: 9, title: item['september'] },
        { val: 10, title: item['october'] },
        { val: 11, title: item['november'] },
        { val: 12, title: item['december'] },
      ];

      this.filterStatus = [
        { 'title': this.status_system_waiting, 'val': 'waiting', 'bg': 'bg-warning' },
        { 'title': this.status_system_waiting, 'val': 'NEW', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': '0', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'ACCEPTED', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'TRANSMTD', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'UNKNOWN', 'bg': 'bg-danger' },
        { 'title': this.status_delivered, 'val': 'Delivered', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'PARTDELIVERED', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'DELIVERED', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'DELIVRD', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': '1', 'bg': 'bg-success' },
        { 'title': this.status_rejected, 'val': '-2', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'Rejected', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'REJECTD', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'REJECTED', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'DELETED', 'bg': 'bg-danger' },
        { 'title': this.status_failed, 'val': 'Failed', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': 'Expired', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': 'EXPIRED', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': '-3', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'ENROUTE', 'bg': 'bg-warning' },
        { 'title': this.status_not_delivered, 'val': 'NotDelivered', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIVRD', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIVERABLE', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIV', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': '-1', 'bg': 'bg-danger' },
        { 'title': this.status_scheduled, 'val': 'scheduled', 'bg': 'bg-warning' },
      ];

      this.payments_type = [
        { val: 'transfer', title: item['Перечисление'] },
        { val: 'cash', title: item['Наличные'] },
        { val: 'free', title: item['Бесплатно'] },
        { val: 'debt', title: item['Долг'] },
        { val: 'recal', title: item['recal'] },
        { val: 'balance_minus', title: item['balance_minus'] },
        { val: 'test', title: item['Для теста'] },
        { val: 'bonus', title: item['Пополнено из Кешбека'] },
        { val: 'pay_balance', title: item['Списано с баланса за ник'] },
        { val: 'user_balance', title: item['Перекидка из баланса пользователя'] },
        { val: 'withdraw_money', title: item['Списано деньги из баланса'] },
      ]

    });

    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');

    this.filter = {
      year: '',
      month: '',
      start_date: '',
      start_dates: '',
      end_date: '',
      end_dates: '',
      time: '',
      region: 'local',
      operator: '',
      status: '',
      client_id: localStorage.getItem('currentCompany'),
      is_ad: ''
    };

    this.search = {
      type: 'phone',
      val: '',
      page: 1,
    }

    this.filterCount = { year: d.getFullYear(), month: d.getMonth() + 1, region: 'local' };

    this.Sms.getCompanies().subscribe((res: any) => {
      if (res) {
        this.companies.set(res);
      }
    })

    this.checkAuth();
  }

  tabChange(event: any) {
    if (event && event.nextId == 2) {
      this.currentPage = 1;
      this.getSmsDetaling(1);
    }
  }

  getSmsDetaling(currentPage: any) {
    this.loader = true;
    this.mailingList.set([]);
    this.Sms.getSmsMailingList(localStorage.getItem('currentCompany'), currentPage).subscribe((res: any) => {
      this.loader = false;
      if (res) {
        this.mailingList.set(res.data);
        this.currentPage = currentPage;
        this.totalPage = res.total;
      }
    }, error => {
      this.loader = false;
    })
  }

  exportSMS(item: any) {
    item.client_id = localStorage.getItem('currentCompany');
    item.status = '';
    this.exportData = item;
    this.alertExport = true;
  }

  exportSMSApprove() {
    this.spinner.show();
    this.Sms.exportSms(this.exportData).subscribe(res => {
      this.spinner.hide();
      if (res.size > 0)
        this.fileSaver.save(res, 'export_sms.csv');
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    });
  }

  smsDetailByDateExport() {
    this.spinner.show();
    this.Sms.smsDetailsByDateExport(this.filter).subscribe(res => {
      this.spinner.hide();
      if (res.size > 0)
        this.fileSaver.save(res, 'export_sms.csv');
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    });
  }

  getSmsDetailsByDate() {
    this.spinner.show();
    this.not_found_data.set(false);
    this.messagesData.set([]);
    this.pager = '';
    if (this.archiveDetail)
      this.filter.archive = true;

    this.Sms.smsDetailsByDate(this.filter).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status == 'success') {
        this.is_history = res.is_history;
        if (!this.is_history)
          this.messagesData.set(res.data.result);
        else
          this.messagesData.set(res.data.data);
        this.currentPageByDate = res.data.current_page;
        this.totalPageByDate = res.data.total;
        this.pageSizeByDate = res.data.per_page;
      }
      else
        this.not_found_data.set(true);
    }, error => {
      this.spinner.hide();
    })
  }

  getSmsDetailsByDateCount() {
    this.Sms.smsDetailsByDateCount(this.filter).subscribe((res: any) => {
      this.spinner.hide();
      this.stWaiC.set(0);
      this.stTRSC.set(0);
      this.stDelC.set(0);
      this.stNotDelC.set(0);
      this.stFailC.set(0);
      this.stSchedC.set(0);
      this.stRejC.set(0);
      this.stExpC.set(0);
      if (res && res.status == 'success') {
        res.data.forEach((item: any) => {
          if (item.status == 'waiting' || item.status == 'NEW')
            this.stWaiC.set(this.stWaiC() + Number(item.total));
          if (item.status == 'TRANSMTD' || item.status == '0' || item.status == 'ACCEPTED' || item.status == 'UNKNOWN')
            this.stTRSC.set(this.stTRSC() + Number(item.total));
          if (item.status == 'Delivered' || item.status == '1' || item.status == 'DELIVRD' || item.status == 'DELIVERED' || item.status == 'PARTDELIVERED')
            this.stDelC.set(this.stDelC() + Number(item.total));
          if (item.status == 'NotDelivered' || item.status == '-1' || item.status == 'UNDELIVRD' || item.status == 'UNDELIV' || item.status == 'UNDELIVERABLE' || item.status == 'ENROUTE')
            this.stNotDelC.set(this.stNotDelC() + Number(item.total));
          if (item.status == 'Failed')
            this.stFailC.set(this.stFailC() + Number(item.total));
          if (item.status == 'scheduled')
            this.stSchedC.set(this.stSchedC() + Number(item.total));
          if (item.status == 'Rejected' || item.status == 'REJECTD' || item.status == '-2' || item.status == 'REJECTED' || item.status == 'DELETED')
            this.stRejC.set(this.stRejC() + Number(item.total));
          if (item.status == 'Expired' || item.status == 'EXPIRED' || item.status == '-3')
            this.stExpC.set(this.stExpC() + Number(item.total));
        })
      }
      else
        this.not_found_data.set(true);
    }, error => {
      this.spinner.hide();
    })
  }

  getSmsDetailsByDateSumm() {
    this.spinner.show();
    this.total_sum_date.set({});
    this.Sms.smsDetailsByDateSumm(this.filter).subscribe((res: any) => {
      this.spinner.hide();
      if (res && res.status == 'success') {
        this.total_sum_date.set(res.result.data);
      }
    }, error => {
      this.spinner.hide();
    })
  }

  getSmsStaticsData() {
    this.Sms.detailByUser(localStorage.getItem('currentCompany'), this.filterCount.year, this.filterCount.month, this.filterCount.region, this.archiveDetail).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.statics = res.data;
        this.totalCount = res.totalCount;
      }
    }, (error: any) => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  getSmsBalanceDetaling() {
    this.Sms.getSmsBalanceDetaling(localStorage.getItem('currentCompany')).subscribe((res: any) => {
      if (res) {
        this.historyBalance.set(res);
        this.historyBalanceTotal = 0;

        if (this.historyBalance() && this.historyBalance().length > 0) {
          this.historyBalance().forEach((item: any) => {
            if (item.payment != 'pay_balance') {
              if (item.payment != 'balance_minus')
                this.historyBalanceTotal += item.amount;
              if (item.payment == 'balance_minus')
                this.historyBalanceTotal -= item.amount;
            }
          })
        }
      }
    }, error => {
      this.spinner.hide();
    })
  }

  checkAuth() {
    if (localStorage.getItem('currentCompany')) {
      this.Sms.checkAuth(localStorage.getItem('currentCompany')).subscribe((res: any) => {
        //this.spinner.hide();
        if (res.status == 'not-found') {
          this.not_found = true;
          this.login_failed = false;
          this.user_blocked = false;
        }
        if (res.status == 'login_failed') {
          this.not_found = false;
          this.user_blocked = false;
          this.login_failed = true;
        }
        if (res.status == 'user_blocked') {
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = true;
        }
        if (res.status == 'success') {
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = false;
          this.getSmsBalanceDetaling();
        }
      }, error => {
        this.spinner.hide();
      })
    }
  }

  filterStatics() {
    this.spinner.show();
    this.getSmsStaticsData();
  }

  cancelSchedule(id: any) {
    this.spinner.show();
    var data = { id: id, client_id: localStorage.getItem('currentCompany') }
    this.Sms.deleteSchedule(data).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.toastr.success('Планировщик успешно был отменен');
        this.getSmsDetaling(1);
      }
      else
        this.toastr.error('Планировщик не было отменена');
    })
  }

  pageChangedByDate(page: any) {
    this.filter.page = page;
    this.getSmsDetailsByDate();
  }

  smsDetailByDateApply() {
    this.filter.page = 1;
    this.getSmsDetailsByDateCount();
    this.getSmsDetailsByDate();
    this.getSmsDetailsByDateSumm();
  }

  getDate(e: any, type: any) {
    var date = ("0" + e.day).slice(-2) + '/' + ("0" + e.month).slice(-2) + '/' + e.year;
    var dateB = e.year + '-' + ("0" + e.month).slice(-2) + '-' + ("0" + e.day).slice(-2);
    if (type == 'start_date') {
      this.filter.start_dates = date;
      this.filter.start_date = dateB;
    }
    if (type == 'end_date') {
      this.filter.end_dates = date;
      this.filter.end_date = dateB;
    }
  }

  viewDetailSms(item: any) {
    this.alertSms = true;
    this.smsData = item;
    this.smsData.part_data = Object.values(this.smsData.parts);
  }

  viewLogSms(item: any) {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown', size: 'lg' });
    modalRef.componentInstance.sms = item;
    modalRef.componentInstance.log_view = true;
  }

  viewCharsSms(item: any) {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown', size: 'lg' });
    modalRef.componentInstance.sms = item;
    modalRef.componentInstance.chars_view = true;
  }

  searchGlobal() {
    this.spinner.show();
    this.search.client_id = localStorage.getItem('currentCompany');
    this.Sms.globalSearch(this.search).subscribe((res: any) => {
      if (res && res.status == 'success') {
        this.spinner.hide();
        this.allClients.set(res.clients);
        this.globalData.set(res.data.result);
        this.currentPage = res.data.current_page;
        this.totalPage = res.data.total;
        this.pageSize = res.data.per_page;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  reportTotalByMonth() {
    this.spinner.show();
    this.Sms.reportTotalByMonth(this.filter).subscribe((res: any) => {
      if (res && res.status == 'success') {
        this.spinner.hide();
        this.reportByMonth.set(res.result.data);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  reportTotalByOperator() {
    this.spinner.show();
    this.Sms.reportTotalByOperator(this.filter).subscribe((res: any) => {
      if (res && res.status == 'success') {
        this.spinner.hide();
        this.reportByOperator.set(res.result.data);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  deleteUndeliveredByPhones() {
    this.spinner.show();
    this.Sms.smsUndeliveredPhones(this.filter).subscribe((res: any) => {
      if (res && res.status == 'success') {
        this.spinner.hide();
        this.toastr.success(this.success_deleted_msg);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    })
  }

  pageChanged(page: any) {
    this.search.page = page;
    this.searchGlobal();
  }

  searchReset() {
    this.search = { type: 'phone', val: '', page: 1 };
    this.globalData.set([]);
  }

  closeAlert() {
    this.smsData = '';
    this.alertSms = false;
    this.alertExport = false;
  }

  filterByStatusDate(status) {
    this.filter.status = status;
    this.getSmsDetailsByDateCount();
    this.getSmsDetailsByDate();
    this.getSmsDetailsByDateSumm();
  }

}

//Sms detaling
@Component({
  selector: 'app-sms-details',
  templateUrl: './sms-details.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), RouterLink, TranslateModule, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, NgbPagination, NgClass, LowerCasePipe, DecimalPipe, DatePipe, FilterPipe, TimePipe, SmsCountPipe]
})
export class SmsDetailsComponent implements OnInit {

  messagesData = signal<any[]>([]);
  currentUser: any;
  filterStatus: any;
  companies = signal<any[]>([]);
  smsData: any;
  not_found: boolean;
  login_failed: boolean;
  user_blocked: boolean;
  loader: boolean;
  alertSms: boolean;
  archiveDetail: boolean;
  status_waiting: string;
  status_delivered: string;
  status_not_delivered: string;
  status_failed: string;
  status_rejected: string;
  status_expired: string;
  status_scheduled: string;
  status_system_waiting: string;
  siteUrl: string;
  currentPage: any;
  totalPage: any;
  pageSize: any;
  currentClient: any;
  counts = signal<any>({});
  countries: any;
  filter: any;
  total_sum_mailing = signal<any>({});
  is_history: boolean;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
  ) {
    this.router.events.subscribe((e: any) => {
      this.archiveDetail = false;
      this.route.params.subscribe((data: any) => {
        if (data.slug && data.slug == 'archive')
          this.archiveDetail = true;
      })
    })
  }

  ngOnInit() {
    this.siteUrl = env.apiUrl
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || ''))));
    this.countries = JSON.parse(localStorage.getItem('countries') || '[]');
    this.translate.get(['sms_status_rejected', 'sms_status_waiting', 'sms_status_delivered', 'sms_status_notdelivered', 'sms_status_failed', 'sms_status_expired', 'scheduled', 'waiting']).subscribe((item: any) => {
      this.status_rejected = item['sms_status_notdelivered'];
      this.status_waiting = item['sms_status_waiting'];
      this.status_delivered = item['sms_status_delivered'];
      this.status_not_delivered = item['sms_status_notdelivered'];
      this.status_failed = item['sms_status_failed'];
      this.status_expired = item['sms_status_expired'];
      this.status_scheduled = item['scheduled'];
      this.status_system_waiting = item['waiting'];

      this.filterStatus = [
        { 'title': this.status_system_waiting, 'val': 'waiting', 'bg': 'bg-warning' },
        { 'title': this.status_system_waiting, 'val': 'NEW', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': '0', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'ACCEPTED', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'TRANSMTD', 'bg': 'bg-warning' },
        { 'title': this.status_waiting, 'val': 'UNKNOWN', 'bg': 'bg-danger' },
        { 'title': this.status_delivered, 'val': 'Delivered', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'PARTDELIVERED', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'DELIVERED', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': 'DELIVRD', 'bg': 'bg-success' },
        { 'title': this.status_delivered, 'val': '1', 'bg': 'bg-success' },
        { 'title': this.status_rejected, 'val': '-2', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'Rejected', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'REJECTD', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'REJECTED', 'bg': 'bg-danger' },
        { 'title': this.status_rejected, 'val': 'DELETED', 'bg': 'bg-danger' },
        { 'title': this.status_failed, 'val': 'Failed', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': 'Expired', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': 'EXPIRED', 'bg': 'bg-danger' },
        { 'title': this.status_expired, 'val': '-3', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'ENROUTE', 'bg': 'bg-warning' },
        { 'title': this.status_not_delivered, 'val': 'NotDelivered', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIVRD', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIVERABLE', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': 'UNDELIV', 'bg': 'bg-danger' },
        { 'title': this.status_not_delivered, 'val': '-1', 'bg': 'bg-danger' },
        { 'title': this.status_scheduled, 'val': 'scheduled', 'bg': 'bg-warning' },
      ];
    });

    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');

    this.filter = {
      id: '',
      client_id: localStorage.getItem('currentCompany'),
      is_ad: '',
      page: 1
    };

    this.Sms.getCompanies().subscribe((res: any) => {
      if (res) {
        this.companies.set(res);
      }
    })

    this.checkAuth();
    this.getSmsDetaling(1);
    this.getSmsDetailsCount();
    this.getSmsDetailsSumm();
  }

  filterApply() {
    this.getSmsDetaling(1);
    this.getSmsDetailsCount();
    this.getSmsDetailsSumm();
  }

  getSmsDetaling(currentPage: any) {
    this.loader = true;
    this.route.params.subscribe((data: any) => {
      if (data.id) {
        this.filter.id = data.id;
        this.filter.page = currentPage;
        this.Sms.getSmsDetails(this.filter).subscribe((res: any) => {
          this.loader = false;
          this.is_history = res.is_history;
          if (!this.is_history)
            this.messagesData.set(res.data.result);
          else
            this.messagesData.set(res.data.data);
          this.currentPage = res.data.current_page;
          this.totalPage = res.data.total;
          this.pageSize = res.data.per_page;
        }, error => {
          this.loader = false;
        })
      }
    })
  }

  getSmsDetailsCount() {
    this.loader = true;
    this.route.params.subscribe((data: any) => {
      if (data.id) {
        this.filter.id = data.id;
        this.Sms.getSmsDetailsCount(this.filter).subscribe((res: any) => {
          this.loader = false;
          if (res && res.status == 'success') {
            this.counts.set({
              stWaiC: 0,
              stTRSC: 0,
              stDelC: 0,
              stNotDelC: 0,
              stFailC: 0,
              stSchedC: 0,
              stRejC: 0,
              stExpC: 0,
            });

            res.data.forEach((item: any) => {
              if (item.status == 'waiting' || item.status == 'NEW')
                this.counts().stWaiC += Number(item.total);
              if (item.status == 'TRANSMTD' || item.status == '0' || item.status == 'ACCEPTED' || item.status == 'UNKNOWN')
                this.counts().stTRSC += Number(item.total);
              if (item.status == 'Delivered' || item.status == '1' || item.status == 'DELIVRD' || item.status == 'DELIVERED' || item.status == 'PARTDELIVERED')
                this.counts().stDelC += Number(item.total);
              if (item.status == 'NotDelivered' || item.status == '-1' || item.status == 'UNDELIVRD' || item.status == 'UNDELIV' || item.status == 'UNDELIVERABLE' || item.status == 'ENROUTE')
                this.counts().stNotDelC += Number(item.total);
              if (item.status == 'Failed')
                this.counts().stFailC += Number(item.total);
              if (item.status == 'scheduled')
                this.counts().stSchedC += Number(item.total);
              if (item.status == 'Rejected' || item.status == 'REJECTD' || item.status == '-2' || item.status == 'REJECTED' || item.status == 'DELETED')
                this.counts().stRejC += Number(item.total);
              if (item.status == 'Expired' || item.status == 'EXPIRED' || item.status == '-3')
                this.counts().stExpC += Number(item.total);
            })
          }
          else
            this.not_found = true;
        }, error => {
          this.loader = false;
        })
      }
    })
  }

  getSmsDetailsSumm() {
    this.route.params.subscribe((data: any) => {
      if (data.id) {
        this.total_sum_mailing.set({});
        this.filter.id = data.id;
        this.Sms.smsDetailsSumm(this.filter).subscribe((res: any) => {
          this.spinner.hide();
          if (res && res.status == 'success') {
            this.total_sum_mailing.set(res.result.data);
          }
        }, error => {
          this.spinner.hide();
        })
      }
    })
  }

  checkAuth() {
    if (localStorage.getItem('currentCompany')) {
      this.Sms.checkAuth(localStorage.getItem('currentCompany')).subscribe((res: any) => {
        this.spinner.hide();
        if (res.status == 'not-found') {
          this.not_found = true;
          this.login_failed = false;
          this.user_blocked = false;
        }
        if (res.status == 'login_failed') {
          this.not_found = false;
          this.user_blocked = false;
          this.login_failed = true;
        }
        if (res.status == 'user_blocked') {
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = true;
        }
        if (res.status == 'success') {
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = false;
        }
      }, error => {
        this.spinner.hide();
      })
    }
  }

  pageChanged(page: any) {
    this.loader = true;
    this.getSmsDetaling(page);
  }

  viewDetailSms(item: any) {
    this.alertSms = true;
    this.smsData = item;
    this.smsData.part_data = Object.values(this.smsData.parts);
  }

  viewCharsSms(item: any) {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown', size: 'lg' });
    modalRef.componentInstance.sms = item;
    modalRef.componentInstance.chars_view = true;
  }

  closeAlert() {
    this.smsData = '';
    this.alertSms = false;
  }

}

@Component({
  selector: 'app-sms-text',
  templateUrl: './sms-text.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), TranslateModule, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, DatePipe, FilterPipe, TimePipe, SmsCountPipe]
})
export class SmsTextComponent implements OnInit {

  templatesData = signal<any[]>([]);
  currentUser: any;
  currentClient: any;
  curLang: string;
  prices: any;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.prices = [];
    this.currentClient.prices.forEach((item: any) => {
      if (item.smsc_id != 6 && item.smsc_id != 8)
        this.prices.push(item);
    })

    if (this.currentClient)
      this.getTemplatesData();
  }

  getTemplatesData() {
    this.Sms.getTemplates(this.currentClient.id).subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
        this.templatesData.set(data);

        this.templatesData().forEach((item: any) => {
          item.operators.splice(item.operators.findIndex(e => e.name === "uzmobile_cdma"), 1);
        })
      }
    })
  }

  addTemplate() {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.templateData = { original_text: '', client_id: this.currentClient.id };

    modalRef.result.then((result) => {
      if (result)
        this.getTemplatesData();
    });
  }

  editTemplate(item: any) {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.templateData = { ...item };
    modalRef.componentInstance.template_edit = true;

    modalRef.result.then((result) => {
      if (result) {
        this.getTemplatesData();
      }
    });
  }

  deleteTemplate(data: any) {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.templateData = { ...data };
    modalRef.componentInstance.template_delete = true;

    modalRef.result.then((result) => {
      if (result)
        this.getTemplatesData();
    });
  }

}

//Sms contact
@Component({
  selector: 'app-sms-contact-modal',
  templateUrl: './sms-contact-modal.component.html',
  imports: [FormsModule, NgxMaskDirective, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, TranslateModule, TimePipe]
})
export class SmsContactModal implements OnInit {
  @Input() contact: any;
  @Input() sms;

  filter: any;
  groups = signal<any[]>([]);
  regions = signal<any[]>([]);
  cities = signal<any[]>([]);
  districts = signal<any[]>([]);
  currentClient: any;
  phoneCode: boolean;
  phoneExist: boolean;
  deleted: boolean;
  edited: boolean;
  log_view: boolean;
  siteUrl: string;
  error_occurred: string;
  successfully_edited: string;
  successfully_added: string;
  successfully_deleted: string;
  sms_no_auth: string;
  phone_flag: string;
  sms_logs = signal<any[]>([]);
  sms_chars = signal<any[]>([]);
  chars_view: boolean;
  export_contact: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private Sms: SmsService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private fileSaver: FileSaverService,
  ) { }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
    this.filter = {
      id: localStorage.getItem('currentCompany'),
      group_id: '',
    }
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.translate.get(['error_occurred', 'successfully_edited', 'successfully_added', 'successfully_deleted', 'sms_no_auth']).subscribe((item: any) => {
      this.error_occurred = item['error_occurred'];
      this.successfully_edited = item['successfully_edited'];
      this.successfully_added = item['successfully_added'];
      this.successfully_deleted = item['successfully_deleted'];
      this.sms_no_auth = item['sms_no_auth'];
    });

    if (this.edited) {
      this.Sms.getSmsGroup(localStorage.getItem('currentCompany')).subscribe(res => {
        this.groups.set(res);
      });

      this.Sms.countries().subscribe((res: any) => {
        this.regions.set(res.regions);

        setTimeout(() => {
          if (this.contact.region)
            this.getCities(this.contact.region);
          if (this.contact.city)
            this.getDistricts(this.contact.city);
        }, 500)
      })
    }

    if (this.log_view) {
      this.Sms.viewLogs(this.sms).subscribe((res: any) => {
        if (res) {
          this.sms_logs.set(res.messages);
        }
      })
    }
    if (this.chars_view) {
      this.Sms.viewChars(this.sms).subscribe((res: any) => {
        if (res) {
          this.sms_chars.set(res.data);
          this.sms.message_char = res.sms_message;
        }
      })
    }
    if (this.export_contact)
      this.getSmsGroupData();
  }

  getCities(name) {
    this.contact.district = '';
    this.cities.set([]);
    this.regions().forEach((item: any) => {
      if (item.name == name)
        this.cities.set(item.cities);
    })
  }

  getDistricts(name) {
    this.districts.set([]);
    this.cities().forEach((item: any) => {
      if (item.name == name)
        this.districts.set(item.districts);
    })
  }

  groupChange(event) {
    this.groups().forEach((item: any) => {
      if (item.title == event)
        this.contact.group_id = item.id;
    });
  }

  getSmsGroupData() {
    this.Sms.getSmsGroup(localStorage.getItem('currentCompany')).subscribe(data => {
      if (data) {
        this.groups.set(data);
      }
    })
  }

  patchContact() {
    this.spinner.show();
    this.contact.client_id = localStorage.getItem('currentCompany');
    if (this.contact.id) {
      this.Sms.updateSmsContact(this.contact).subscribe(
        (data: any) => {
          this.spinner.hide();
          if (data.status == 'success') {
            this.activeModal.close(this.contact);
            this.toastr.success(this.successfully_edited);
          }
          if (data.status == 'not-save')
            this.toastr.error(this.error_occurred);
          if (data.status == 'not-found')
            this.toastr.error(this.sms_no_auth);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error(this.error_occurred);
        }
      );
    } else {
      this.Sms.createSmsContact(this.contact).subscribe(
        (data: any) => {
          this.spinner.hide();
          if (data.status == 'success') {
            this.activeModal.close(this.contact);
            this.toastr.success(this.successfully_added);
          }
          if (data.status == 'not-save')
            this.toastr.error(this.error_occurred);
          if (data.status == 'not-found')
            this.toastr.error(this.sms_no_auth);
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error(this.error_occurred);
        }
      );
    }
  }

  deleteContact() {
    this.spinner.show();
    this.Sms.deleteSmsContact(this.contact).subscribe(
      (data: any) => {
        if (data) {
          this.spinner.hide();
          if (data.status == 'success') {
            this.activeModal.close(this.contact);
            this.toastr.success(this.successfully_deleted);
          }
          if (data.status == 'not-delete')
            this.toastr.error(this.error_occurred);
          if (data.status == 'not-found')
            this.toastr.error(this.sms_no_auth);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(this.error_occurred);
      }
    );
  }

  exportContact() {
    this.spinner.show();
    this.Sms.exportContacts(this.filter).subscribe(res => {
      this.spinner.hide();
      if (res.size > 0)
        this.fileSaver.save(res, 'contacts.xlsx');
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    });
  }

}

@Component({
  selector: 'app-sms-contact',
  templateUrl: './sms-contact.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), RouterLink, FormsModule, NgClass, NgbTooltip, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, NgbPagination, TranslateModule]
})
export class SmsContactComponent implements OnInit {

  curLang: string;
  siteUrl: string;
  contacts = signal<any[]>([]);
  regions = signal<any[]>([]);
  cities = signal<any[]>([]);
  currentUser: any;
  currentClient: any;
  progressBarContent: boolean;
  progressBar: number = 0;
  not_found: boolean;
  login_failed: boolean;
  user_blocked: boolean;
  uploadFiles: any = [];
  previewImages: any = [];
  invalid_file_format: string;
  contacts_loading_successfully_completed: string;
  invalid_file_information: string;
  create_least_one_contact_group: string;
  please_checked_one_contact: string;
  successfully_deleted: string;
  currentPage: number;
  perPage: number;
  totalPage: number = 0;
  totalActive: number = 0;
  totalNoActive: number = 0;
  totalBlocked: number = 0;
  search: any;
  resultSearch = signal<any[]>([]);
  removeContactsIDs: any;
  templateFileLink: string;
  filter: any;
  curStatus: string;
  alertRemove: boolean;
  alertRemoveAll: boolean;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private Upload: UploadService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.siteUrl = env.apiUrl;
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.templateFileLink = '/assets/data/contacts.xlsx';
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.currentClient && this.currentClient.option_contact == 'yes')
      this.templateFileLink = '/assets/data/contacts_vip.xlsx';

    this.translate.get(['invalid_file_format', 'contacts_loading_successfully_completed', 'invalid_file_information', 'create_least_one_contact_group', 'please_checked_one_contact', 'successfully_deleted']).subscribe((item: any) => {
      this.invalid_file_format = item['invalid_file_format'];
      this.contacts_loading_successfully_completed = item['contacts_loading_successfully_completed'];
      this.invalid_file_information = item['invalid_file_information'];
      this.create_least_one_contact_group = item['create_least_one_contact_group'];
      this.please_checked_one_contact = item['please_checked_one_contact'];
      this.successfully_deleted = item['successfully_deleted'];
    });
    this.search = {
      id: localStorage.getItem('currentCompany'),
      option: 'phone',
      age: '',
      gender: '',
      ctatus: '',
      region: '',
      city: '',
      dogovor: '',
    }

    this.curStatus = '';

    this.filter = {
      page: 1,
      status: '',
      id: ''
    }

    this.checkAuth();

    this.Sms.countries().subscribe((res: any) => {
      this.regions.set(res.regions);
    })
  }

  getCities(name: any) {
    this.cities.set([]);
    this.regions().forEach((item: any) => {
      if (item.name == name)
        this.cities.set(item.cities);
    })
  }

  checkAuth() {
    if (localStorage.getItem('currentCompany')) {
      this.Sms.checkAuth(localStorage.getItem('currentCompany')).subscribe((res: any) => {
        this.spinner.hide();
        if (res.status == 'not-found') {
          this.not_found = true;
          this.login_failed = false;
          this.user_blocked = false;
        }
        if (res.status == 'login_failed') {
          this.not_found = false;
          this.user_blocked = false;
          this.login_failed = true;
        }
        if (res.status == 'user_blocked') {
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = true;
        }
        if (res.status == 'success') {
          this.getSmsContactData();
          this.not_found = false;
          this.login_failed = false;
          this.user_blocked = false;
        }
      }, error => {
        this.spinner.hide();
      })
    }
  }

  getSmsContactData() {
    this.route.queryParamMap.subscribe((data: any) => {
      if (data.params.page)
        this.getSmsContacts(data.params.page);
      else
        this.getSmsContacts(1);
    });
  }

  getSmsContacts(curPage) {
    this.filter.page = curPage;
    this.filter.status = this.curStatus;
    this.filter.id = localStorage.getItem('currentCompany');
    this.Sms.getSmsContact(this.filter).subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
        this.contacts.set(data.contacts.data);
        this.currentPage = data.contacts.current_page;
        this.totalPage = data.contacts.total;
        this.perPage = data.contacts.per_page;
        this.totalActive = data.total_active;
        this.totalNoActive = data.total_process;
        this.totalBlocked = data.total_blocked;
        this.closeAlert();
      }
    })
  }

  setStatus(status) {
    this.spinner.show();
    this.curStatus = status;
    this.getSmsContacts(1);
  }

  pageChanged(page) {
    this.spinner.show();
    this.router.navigate(['/sms/contact'], { queryParams: { page: page } });
  }

  searchContact() {
    this.spinner.show();
    this.Sms.searchContact(this.search).subscribe((data: any) => {
      this.resultSearch.set(data);
      this.spinner.hide();
    })
  }

  searchReset() {
    this.search = {
      id: localStorage.getItem('currentCompany'),
      option: 'phone',
      age: '',
      gender: '',
      ctatus: '',
      region: '',
      city: '',
      dogovor: '',
    }
    this.resultSearch.set([]);
  }

  addContact() {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.contact = { name: '', phone: '', group_id: '', gender: '', dob: '', age: '', ctatus: '', region: '', city: '', district: '', summa: '', dogovor: '' };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsContacts(1);
    });
  }

  editContact(contact: any) {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.contact = { ...contact };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsContacts(1);
    });
  }

  deleteContact(contact: any) {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.contact = { ...contact };
    modalRef.componentInstance.deleted = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsContacts(1);
    });
  }

  importContact(event: any) {
    var validExts = new Array(".xlsx");
    var fileExt = event.target.value;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.toastr.error(this.invalid_file_format);
      return false;
    } else {
      if (event.target.files && event.target.files.length > 0) {
        var timer = Math.round(event.target.files[0].size / 150);
        this.Upload.filePreview(event.target.files).subscribe(res => {
          if (res) {
            this.uploadFiles = res[0].files;
            setTimeout(() => {
              this.progressBarContent = true;
              var interval = setInterval(() => {
                this.progressBar += 5;
                if (this.progressBar >= 100) {
                  clearInterval(interval);
                }
              }, timer);
              var currentCompany = localStorage.getItem('currentCompany');
              this.Upload.fileUpload(env.apiUrl + '/api/sms-import-contacts', currentCompany, this.uploadFiles).subscribe((data: any) => {
                if (data instanceof HttpResponse) {
                  var status = data.body.status;
                  clearInterval(interval);
                  this.progressBar = 0;
                  this.progressBarContent = false;
                  this.uploadFiles = [];
                  this.previewImages = [];
                  if (<HTMLInputElement>document.getElementById("uploadCaptureInputFile"))
                    (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = '';
                  if (status == 'success') {
                    this.getSmsContacts(1);
                    this.toastr.success(this.contacts_loading_successfully_completed);
                  }
                  if (status == 'error')
                    this.toastr.error(data.body.message);
                  if (status == 'not_allowed_format')
                    this.toastr.error(this.invalid_file_information);
                  if (status == 'not_uploaded')
                    this.toastr.error('Контакты не загрузились, проверти всю информацию, заполните все поля, после, попробуйте занова');
                  if (status == 'no-group')
                    this.toastr.error(this.create_least_one_contact_group);
                  if (status == 'name_exceed_lentgh')
                    this.toastr.error('Контакты не загрузились, укаратите имю контакта "' + data.body.result + '"');
                }
              }, error => {
                this.progressBar = 0;
                this.progressBarContent = false;
                this.uploadFiles = [];
                this.previewImages = [];
                this.toastr.error('Неверный формат файла, исправьте формат файла на .XLSX');
                if (<HTMLInputElement>document.getElementById("uploadCaptureInputFile"))
                  (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = '';
              });
            }, 500);
          }
        })
      }
    }
  }

  exportContact() {
    const modalRef = this.modalService.open(SmsContactModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.export_contact = true;
  }

  handleContactDeleteAll(value: any) {
    var check = value.currentTarget.checked;
    for (var i = 0; i < this.contacts().length; i++) {
      this.contacts()[i].selected = check;
    }
  }

  deleteSelected() {
    this.removeContactsIDs = [];
    for (var i = 0; i < this.contacts().length; i++) {
      if (this.contacts()[i].selected)
        this.removeContactsIDs.push(this.contacts()[i].id);
    }
    setTimeout(() => {
      if (this.removeContactsIDs.length > 0)
        this.alertRemove = true;
      else
        this.toastr.error(this.please_checked_one_contact);
    }, 400);
  }

  deleteContactsAll() {
    this.alertRemoveAll = true;
  }

  closeAlert() {
    this.alertRemove = false;
    this.alertRemoveAll = false;
  }

  deleteSelectedApprove() {
    this.spinner.show();
    var contactsDel = { contacts: this.removeContactsIDs, client_id: localStorage.getItem('currentCompany') };
    this.Sms.deleteContactsMore(contactsDel).subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.toastr.success(this.successfully_deleted);
        this.getSmsContacts(1);
      }
    })
  }

  deleteContactsAllApprove() {
    this.spinner.show();
    this.Sms.deleteContactsAll(localStorage.getItem('currentCompany')).subscribe((data: any) => {
      this.spinner.hide();
      if (data) {
        this.toastr.success(this.successfully_deleted);
        this.getSmsContacts(1);
      }
    })
  }

}

//Sms group
@Component({
  selector: 'app-sms-group-modal',
  templateUrl: './sms-group-modal.component.html',
  imports: [FormsModule, TranslateModule, SmsCountPipe]
})
export class SmsGroupModal implements OnInit {
  @Input() group: any;
  @Input() data: any;
  @Input() regions: any;

  deleted: boolean;
  deleted_anketa: boolean;
  edited: boolean;
  edited_anketa: boolean;
  error_occurred: string;
  successfully_edited: string;
  successfully_added: string;
  successfully_deleted: string;
  request_successfully_sent: string;
  sms_limited_access_send: string;
  sms_required_deal_contract: string;
  sms_test_waiting_alert_msg: string;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private Sms: SmsService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.translate.get(['error_occurred', 'successfully_edited', 'successfully_added', 'successfully_deleted', 'request_successfully_sent', 'sms_limited_access_send', 'required_deal_contract', 'sms_test_waiting_alert_msg']).subscribe((item: any) => {
      this.error_occurred = item['error_occurred'];
      this.successfully_edited = item['successfully_edited'];
      this.successfully_added = item['successfully_added'];
      this.successfully_deleted = item['successfully_deleted'];
      this.request_successfully_sent = item['request_successfully_sent'];
      this.sms_limited_access_send = item['sms_limited_access_send'];
      this.sms_required_deal_contract = item['required_deal_contract'];
      this.sms_test_waiting_alert_msg = item['sms_test_waiting_alert_msg'];
    });
  }

  patchGroup() {
    this.spinner.show();
    if (this.group.id) {
      this.Sms.updateSmsGroup(this.group).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.group);
            this.toastr.success(this.successfully_edited);
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.Sms.createSmsGroup(this.group).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.group);
            this.toastr.success(this.successfully_added);
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  deleteGroup() {
    this.spinner.show();
    this.Sms.deleteSmsGroup(this.group).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success(this.successfully_deleted);
          this.activeModal.close(this.group);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  createData() {
    var curClient = JSON.parse(localStorage.getItem('currentClient') || '');
    var clientAccess = false;
    if (curClient.type == 'client') {
      if (curClient.status == 'active' || curClient.status == 'indebted')
        clientAccess = true;
    }

    if (clientAccess) {
      this.spinner.show();
      if (this.data.id) {
        this.Sms.updateSmsTarget(this.data).subscribe(
          data => {
            if (data) {
              this.spinner.hide();
              this.activeModal.close(this.data);
              this.toastr.success(this.request_successfully_sent);
            }
          },
          error => {
            this.spinner.hide();
            this.toastr.error(error.error.message);
          }
        );
      } else {
        this.Sms.createSmsTarget(this.data).subscribe(
          data => {
            if (data) {
              this.spinner.hide();
              this.activeModal.close(this.data);
              this.toastr.success(this.request_successfully_sent);
            }
          },
          error => {
            this.spinner.hide();
            this.toastr.error(error.error.message);
          }
        );
      }
    }
    else if (curClient.type == 'client' && !clientAccess)
      this.toastr.error(this.sms_limited_access_send);
    else if (curClient.type == 'test')
      this.toastr.error(this.sms_required_deal_contract);
  }

  deleteData() {
    this.spinner.show();
    this.Sms.deleteSmsTarget(this.data).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success(this.successfully_deleted);
          this.activeModal.close(this.data);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

}

@Component({
  selector: 'app-sms-group',
  templateUrl: './sms-group.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbTooltip, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, TranslateModule]
})
export class SmsGroupComponent implements OnInit {

  groups = signal<any>([]);
  currentUser: any;
  currentClient: any;
  successfully_deleted: string;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.currentClient)
      this.getSmsGroupData();
  }

  getSmsGroupData() {
    this.Sms.getSmsGroup(localStorage.getItem('currentCompany')).subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
        this.groups.set(data);

        this.translate.get(['successfully_deleted']).subscribe((item: any) => {
          this.successfully_deleted = item['successfully_deleted'];
        });
      }
    })
  }

  addGroup() {
    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.group = { title: '' };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsGroupData();
    });
  }

  editGroup(group: any) {
    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.group = { ...group };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsGroupData();
    });
  }

  deleteGroup(group: any) {
    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.group = { ...group };
    modalRef.componentInstance.deleted = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsGroupData();
    });
  }

  deleteAll() {
    this.spinner.show();
    this.Sms.deleteSmsGroupAll().subscribe((res: any) => {
      this.spinner.hide();
      if (res) {
        this.toastr.success(this.successfully_deleted);
        this.getSmsGroupData();
      }
    })
  }

}

//Sms template
@Component({
  selector: 'app-sms-template-modal',
  templateUrl: './sms-template-modal.component.html',
  imports: [FormsModule, TranslateModule, NgxMaskDirective, DecimalPipe]
})
export class SmsTemplateModal implements OnInit {
  @Input() template: any;
  @Input() anketa: any;
  @Input() templateData: any;
  @Input() balanceData: any;
  @Input() blacklist: any;

  deleted: boolean;
  template_delete: boolean;
  template_edit: boolean;
  edited: boolean;
  blacklist_edited: boolean;
  blacklist_deleted: boolean;
  blacklist_batch: boolean;
  add_request: boolean;
  balance_bonus: boolean;
  symbol: string;
  error_occurred: string;
  successfully_edited: string;
  successfully_added: string;
  successfully_deleted: string;
  sms_nick_not_access_smg: string;
  sms_text_doesnt_access_smg: string;
  sms_limited_access_send: string;
  sms_required_deal_contract: string;
  sms_test_waiting_alert_msg: string;
  sms_illegal_found_word_msg: string;
  phone_incorrect_msg: string;
  curLang: string;
  smsCountLimit: boolean;
  upload_file = signal<boolean>(false);
  smsCount: number;
  smsLength: number;
  tariff = signal<any>({});
  curClient: any;
  uploadFiles: any = [];
  blacklist_keywords: any = [];
  invalid_file_format: string;
  download_file_txt: string;
  siteUrl: string;
  currentClient: any;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private Sms: SmsService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private Upload: UploadService,
    private File: FileService,
  ) { }

  ngOnInit() {
    this.siteUrl = env.apiUrl;
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.translate.get(['error_occurred', 'successfully_edited', 'successfully_added', 'successfully_deleted', 'sms_nick_not_access', 'sms_text_doesnt_access', 'sms_limited_access_send', 'required_deal_contract', 'sms_test_waiting_alert_msg', 'sms_illegal_found_word', 'phone_incorrect', 'invalid_file_format', 'Загрузите файл']).subscribe((item: any) => {
      this.error_occurred = item['error_occurred'];
      this.successfully_edited = item['successfully_edited'];
      this.successfully_added = item['successfully_added'];
      this.successfully_deleted = item['successfully_deleted'];
      this.sms_nick_not_access_smg = item['sms_nick_not_access'];
      this.sms_text_doesnt_access_smg = item['sms_text_doesnt_access'];
      this.sms_limited_access_send = item['sms_limited_access_send'];
      this.sms_required_deal_contract = item['required_deal_contract'];
      this.sms_test_waiting_alert_msg = item['sms_test_waiting_alert_msg'];
      this.sms_illegal_found_word_msg = item['sms_illegal_found_word'];
      this.phone_incorrect_msg = item['phone_incorrect'];
      this.invalid_file_format = item['invalid_file_format'];
      this.download_file_txt = item['Загрузите файл'];
    });
    this.symbol = '{name}';
    this.smsLength = 0;
    if (localStorage.getItem('currentClient'))
      this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');

    if (this.balance_bonus) {
      this.Sms.getResellerTariff().subscribe((res: any) => {
        if (res)
          this.tariff.set(res);
      })
    }
  }

  addNameToText() {
    this.template.text = 'Привет {name} ' + this.template.text;
  }

  patchTemplate() {
    this.spinner.show();
    if (this.template.id) {
      this.Sms.updateSmsTemplate(this.template).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.template);
            this.toastr.success(this.successfully_edited);
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(this.error_occurred);
        }
      );
    } else {
      this.Sms.createSmsTemplate(this.template).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.template);
            this.toastr.success(this.successfully_added);
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(this.error_occurred);
        }
      );
    }
  }

  deleteTemplate() {
    this.spinner.show();
    this.Sms.deleteSmsTemplate(this.template).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success(this.successfully_deleted);
          this.activeModal.close(this.template);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(this.error_occurred);
      }
    );
  }

  deleteTemplateData() {
    this.spinner.show();
    this.Sms.deleteTemplateData(this.templateData).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success(this.successfully_deleted);
          this.activeModal.close(this.templateData);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(this.error_occurred);
      }
    );
  }

  patchTemplateData() {
    this.blacklist_keywords = [];
    this.curClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.curClient.type == 'client') {
      this.spinner.show();
      if (this.templateData.id) {
        this.Sms.editTemplate(this.templateData).subscribe((res: any) => {
          this.spinner.hide();
          if (res.status == 'success') {
            this.activeModal.close(this.templateData);
            this.toastr.success(this.successfully_edited);
          }
          if (res.status == 'blacklist') {
            this.toastr.error(this.sms_illegal_found_word_msg);
            this.blacklist_keywords = res.result;
          }
        },
          error => {
            this.spinner.hide();
            this.toastr.error(error.error.message);
          });
      } else {
        this.Sms.addTemplate(this.templateData).subscribe((res: any) => {
          this.spinner.hide();
          if (res.status == 'success') {
            this.activeModal.close(this.templateData);
            this.toastr.success(this.successfully_added);
          }
          if (res.status == 'blacklist') {
            this.toastr.error(this.sms_illegal_found_word_msg);
            this.blacklist_keywords = res.result;
          }
        },
          error => {
            this.spinner.hide();
            this.toastr.error(error.error.message);
          });
      }
    }
    else if (this.curClient.type == 'test')
      this.toastr.error(this.sms_required_deal_contract);
  }

  sendRequest() {
    this.curClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.curClient.type == 'client') {
      if (this.anketa.file) {
        this.spinner.show();
        this.anketa.client_id = localStorage.getItem('currentCompany');
        this.Sms.patchAnketa(this.anketa).subscribe((res: any) => {
          this.spinner.hide();
          if (res.status == 'success') {
            this.activeModal.close(this.anketa);
            this.toastr.success('Заявка успешно отправлено');
          }
        }, error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        })
      } else
        this.toastr.error(this.download_file_txt);
    }
    // else if(this.curClient.type == 'client' && this.curClient.status != 'active')
    //   this.toastr.error(this.sms_nick_not_access_smg);
    else if (this.curClient.type == 'test')
      this.toastr.error(this.sms_required_deal_contract);
  }

  messageText(event: any) {
    this.smsCount = Number(this.messageCalcCount(event));
    this.smsLength = event.length;
  }

  messageCalcCount(event: any) {
    var regexp = new RegExp("^[A-Za-z0-9 \\r\\n@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘ\u0394_\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039EÆæßÉ!\"#$%&'()*+,\\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\\\\\[~\\]|\u20AC]*$");
    var isGsm = regexp.test(event);

    var smsCount;
    this.smsCountLimit = false;

    if (!isGsm) {
      if (event.length <= 70)
        smsCount = 1;
      else if (event.length <= 134)
        smsCount = 2;
      else if (event.length <= 201)
        smsCount = 3;
      else if (event.length <= 268)
        smsCount = 4;
      else if (event.length <= 335)
        smsCount = 5;
      else if (event.length <= 402)
        smsCount = 6;
      else if (event.length <= 469)
        smsCount = 7;
      else if (event.length <= 536)
        smsCount = 8;
      else
        this.smsCountLimit = true;
    }

    if (isGsm) {
      if (event.length <= 160)
        smsCount = 1;
      else if (event.length <= 306)
        smsCount = 2;
      else if (event.length <= 459)
        smsCount = 3;
      else if (event.length <= 612)
        smsCount = 4;
      else if (event.length <= 765)
        smsCount = 5;
      else if (event.length <= 918)
        smsCount = 6;
      else if (event.length <= 1071)
        smsCount = 7;
      else if (event.length <= 1224)
        smsCount = 8;
      else
        this.smsCountLimit = true;
    }

    if (event == '')
      smsCount = 0;

    return smsCount;
  }

  addBalance() {
    this.spinner.show();
    this.Sms.addBalanceByBonus(this.balanceData).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.activeModal.close(this.balanceData);
        this.toastr.success(this.successfully_added);
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.error.message);
    });
  }

  patchBlacklist() {
    this.spinner.show();
    this.Sms.addBlacklist(this.blacklist).subscribe(
      (data: any) => {
        this.spinner.hide();
        if (data.status == 'success') {
          this.activeModal.close(this.blacklist);
          this.toastr.success('Черный список успешно создан');
        }
      },
      error => {
        this.spinner.hide();
        if (this.blacklist.type == 'phone' && error.error.message == 'Не удалось добавить')
          this.toastr.error(this.phone_incorrect_msg);
        else
          this.toastr.error(error.error.message);
      }
    );
  }

  deleteBlacklist() {
    this.spinner.show();
    this.Sms.deleteBlacklist(this.blacklist).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success('Черный список успешно удален');
          this.activeModal.close(this.blacklist);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  removeFile() {
    this.File.deleteOther(this.anketa.file, 'nik-files').subscribe((data: any) => {
      if (data.status == 'success') {
        if (<HTMLInputElement>document.getElementById("uploadFile"))
          (<HTMLInputElement>document.getElementById("uploadFile")).value = '';

        this.anketa.file = '';
      }
      else if (data.status == 'error')
        this.toastr.error(data.message);
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'application/pdf') {
        this.upload_file.set(true);
        this.Upload.filePreview(event.target.files).subscribe(res => {
          if (res) {
            let files: any = [];
            if (res) {
              files.push(res[0].files);
            }
            setTimeout(() => {
              files.forEach((file: any) => {
                if (file[0]) {
                  if (event.target.files[0].type != 'application/pdf')
                    file[0].name = event.target.files[0].name;

                  this.uploadFiles.push(file[0]);
                }
              })
              this.Upload.fileUpload(env.apiUrl + '/api/upload-other', 'nik-files', this.uploadFiles).subscribe((data: any) => {
                if (data.body && data.body.status == 'success') {
                  this.anketa.file = data.body.file.filename;
                  this.uploadFiles = [];
                  if (<HTMLInputElement>document.getElementById("uploadFile"))
                    (<HTMLInputElement>document.getElementById("uploadFile")).value = '';
                  this.upload_file.set(false);
                }
              }, error => {

              });
            }, 500);
          }
        })
      }
      else
        this.toastr.error(this.invalid_file_format);
    }
  }

  batchBlacklist(event: any) {
    this.uploadFiles = [];
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.Upload.filePreview(event.target.files).subscribe(res => {
          if (res) {
            let files: any = [];
            if (res) {
              files.push(res[0].files);
            }
            setTimeout(() => {
              files.forEach((file: any) => {
                if (file[0]) {
                  this.uploadFiles.push(file[0]);
                }
              })
              this.spinner.show();
              this.Upload.fileUpload(env.apiUrl + '/api/blacklist-sms-import/' + this.blacklist.client_id, this.blacklist.action, this.uploadFiles).subscribe((data: any) => {
                if (data.type == HttpEventType.UploadProgress) {
                  const percentDone = Math.round(100 * data.loaded / data.total);
                } else if (data instanceof HttpResponse) {
                  var status = data.body.status;
                  this.upload_file.set(false);
                  if (status == 'success' && data.body.file) {
                    this.anketa.file = data.body.file.filename;
                    this.uploadFiles = [];
                    if (<HTMLInputElement>document.getElementById("uploadCaptureInputFile"))
                      (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = '';
                  }
                  this.spinner.hide();
                  this.toastr.success(data.body.message);
                  this.activeModal.close(this.blacklist);
                }
              }, error => {
                this.spinner.hide();
                if (<HTMLInputElement>document.getElementById("uploadCaptureInputFile"))
                  (<HTMLInputElement>document.getElementById("uploadCaptureInputFile")).value = '';
                this.toastr.error(error.error.message);
              });
            }, 500);
          }
        })
      }
      else
        this.toastr.error(this.invalid_file_format);
    } else
      this.toastr.error(this.download_file_txt);
  }

  calcCharacter(text: any) {
    if (text) {
      this.Sms.checkSmsMessage({ text: text, id: this.currentClient.api_user_id }).subscribe((res: any) => {
        if (res.data) {
          this.smsLength = res.data.chars_count;
          this.smsCount = res.data.parts_count;
        }
      })
    }
  }

}

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbTooltip, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, TranslateModule]
})
export class SmsTemplateComponent implements OnInit {

  templates = signal<any>([]);
  currentUser: any;
  currentClient: any;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.currentClient)
      this.getSmsTemplateData();
  }

  getSmsTemplateData() {
    this.Sms.getSmsTemplate().subscribe(data => {
      if (data) {
        this.spinner.hide();
        this.templates.set(data);
      }
    })
  }

  addTemplate() {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.template = { title: '', text: '' };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTemplateData();
    });
  }

  editTemplate(template: any) {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.template = { ...template };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTemplateData();
    });
  }

  deleteTemplate(template: any) {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.template = { ...template };
    modalRef.componentInstance.deleted = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTemplateData();
    });
  }

}

//Sms settings
@Component({
  selector: 'app-sms-settings',
  templateUrl: './sms-settings.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), FormsModule, TranslateModule]
})
export class SmsSettingsComponent implements OnInit {

  setting = signal<any>({});
  currentUser: any;
  interval: any;
  hours: any;
  minutes: any;
  seconds: any;
  currentClient: any;
  not_found: boolean;
  session_expired: boolean;
  authorization_sms_failed: string;
  authorization_sms_success: string;
  expire_time_counter: string;
  curLang: string;

  constructor(
    private Sms: SmsService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.translate.get(['authorization_sms_failed', 'authorization_sms_success']).subscribe((item: any) => {
      this.authorization_sms_failed = item['authorization_sms_failed'];
      this.authorization_sms_success = item['authorization_sms_success'];
    });
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.currentClient)
      this.getSetting();
  }

  getSetting() {
    this.Sms.getSetting(localStorage.getItem('currentCompany')).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'not-found') {
        this.setting.set({
          secret_key: ''
        })
        this.not_found = true;
      }
      if (res.status == 'success') {
        this.setting.set(res.data);
        this.not_found = false;
      }
    })
  }

  expireTokenCounter(date) {
    var countDownDate = new Date(date).getTime();
    var distance = 0;
    this.interval = setInterval(() => {
      var now = new Date().getTime();
      distance = countDownDate - now;
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (this.hours < 10)
        this.hours = '0' + this.hours;
      if (this.minutes < 10)
        this.minutes = '0' + this.minutes;
      if (this.seconds < 10)
        this.seconds = '0' + this.seconds;

      this.session_expired = false;

      if (distance < 0) {
        clearInterval(this.interval);
        this.session_expired = true;
      }
    }, 1000);
  }

  stopCounter() {
    if (this.interval)
      clearInterval(this.interval);
  }

  saveSettings() {
    this.spinner.show();
    this.Sms.setAuth(this.setting()).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.toastr.success(this.authorization_sms_success);
        this.not_found = false;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(this.authorization_sms_failed);
    })
  }


}

//Sms request
@Component({
  selector: 'app-sms-request',
  templateUrl: './sms-request.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, NgbNavOutlet, TranslateModule, TimePipe]
})
export class SmsRequestComponent implements OnInit {

  setting = signal<any>({});
  currentUser: any;
  anketaData = signal<any>([]);
  nikData = signal<any>([]);
  currentClient: any;
  not_found: boolean;
  session_expired: boolean;
  is_nick: boolean;
  authorization_sms_failed: string;
  authorization_sms_success: string;
  expire_time_counter: string;
  curLang: string;

  constructor(
    private Sms: SmsService,
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.is_nick = true;
    if (this.currentUser.role == 'employee' && this.currentUser.nick)
      this.is_nick = false;

    this.translate.get(['authorization_sms_failed', 'authorization_sms_success']).subscribe((item: any) => {
      this.authorization_sms_failed = item['authorization_sms_failed'];
      this.authorization_sms_success = item['authorization_sms_success'];
    });
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    if (this.currentClient)
      this.getSettings();
  }

  getSettings() {
    this.Sms.getSetting(localStorage.getItem('currentCompany')).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == 'not-found') {
        this.setting.set({
          secret_key: ''
        })
        this.not_found = true;
      }
      if (res.status == 'success') {
        this.setting.set(res.data);
        this.not_found = false;
        this.getAnketa();
        this.getNickStatus();
      }
    })
  }

  getAnketa() {
    this.Sms.listAnketa(this.setting().id).subscribe((res: any) => {
      this.spinner.hide();
      if (res.data)
        this.anketaData.set(res.data);
    })
  }

  getNickStatus() {
    this.Sms.smsNikByClient(this.setting().id).subscribe((res: any) => {
      this.spinner.hide();
      if (res)
        this.nikData.set(res);
    })
  }

  addRequest() {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.anketa = { nic: '', description: '', text_1: '', text_2: '', file: '' };
    modalRef.componentInstance.add_request = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSettings();
    });
  }

}

@Component({
  selector: 'app-sms-prices',
  templateUrl: './sms-prices.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, FormsModule, NgbNavOutlet, DecimalPipe, TranslateModule, FilterPipe, SearchPipe]
})
export class SmsPricesComponent implements OnInit {

  tariffs = signal<any>([]);
  currentUser: any;
  currentClient: any;
  searchTariff: any;
  curLang: any;
  companies = signal<any>([]);
  prices: any;

  constructor(
    private Sms: SmsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.currentClient.ad_price = 175;
    this.prices = [];
    this.currentClient.prices.forEach((item: any) => {
      if (item.smsc_id != 6 && item.smsc_id != 8)
        this.prices.push(item);
    })
    this.getCompanies();
    this.getSmsTariffs();
  }

  getSmsTariffs() {
    this.Sms.getSmsTariffs().subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
        this.tariffs.set(data);
      }
    })
  }

  getCompanies() {
    this.Sms.getCompanies().subscribe((res: any) => {
      if (res) {
        this.companies.set(res);
      }
    })
  }

}

@Component({
  selector: 'app-sms-target',
  templateUrl: './sms-target.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), NgbNav, NgbNavItem, NgbNavLink, NgbNavContent, NgxDocViewerModule, NgbAccordionHeader, NgbAccordionButton, NgbAccordionBody, NgbAccordionCollapse, NgbAccordionItem, NgbAccordionDirective, RouterLink, TranslateModule, NgbNavOutlet, FilterPipe, TimePipe, SmsCountPipe]
})
export class SmsTargetComponent implements OnInit {

  dataItems = signal<any>([]);
  currentUser: any;
  currentClient: any;
  searchTariff: any;
  curLang: any;
  regions = signal<any>([]);
  filterStatus: any;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private fileSaver: FileSaverService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');

    this.translate.get(['В ожидании', 'Заявка принято', 'Отказано от Билайна', 'sms_status_notdelivered', 'sms_status_failed', 'sms_status_expired', 'scheduled', 'waiting']).subscribe((item: any) => {
      this.filterStatus = [
        { 'title': item['В ожидании'], 'val': 'waiting', 'bg': 'bg-warning' },
        { 'title': item['Заявка принято'], 'val': 'accepted', 'bg': 'bg-primary' },
        { 'title': item['Отказано от Билайна'], 'val': 'rejected', 'bg': 'bg-danger' },
        { 'title': item['Выполнено'], 'val': 'completed', 'bg': 'bg-success' },
      ];
    });

    this.Sms.getRegion('61').subscribe((res: any) => {
      this.regions.set(res);
      this.getSmsTargets();
    });
  }

  getSmsTargets() {
    this.Sms.getSmsTargets().subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
        this.dataItems.set(data);
      }
    })
  }

  createData() {
    var anketa = {
      gender: null,
      age: null,
      income: null,
      kids: null,
      family: null,
      imei: null,
      type_phone: null,
      system: null,
      home_zid: null,
      job_zid: null,
      real_estate: null,
      owning_car: null,
      work: null,
      student: null,
      pupil: null,
      pensioner: null,
      arpu: null,
      total_arpu: null,
      duration_beeline: null,
      card_hold: null,
      app_website: null,
      bank: null,
      social: null,
      social_usage: null,
      mes_app: null,
      mes_app_usage: null,
      payment_system: null,
      payment_systems: null,
      payment_trans: null,
      driver_taxi: null,
      driver_taxi_usage: null,
      use_taxi: null,
      driver_taxi_app: null,
      service_taxi: null,
      calls_taxi: null,
      interest_invest: null,
      interest_job: null,
      interest_del_meal: null,
      interest_insurance: null,
      interest_travel: null,
      usage_shop_games: null,
      interest_technics: null,
      ads_boards: null,
      interest_car: null,
      interest_carsharing: null,
      interest_higher_edu: null,
      interest_add_edu: null,
      interest_learn_lang: null,
      interest_online_edu: null,
      interest_market: null,
      interest_supermarket: null,
      interest_supermarket_cat: null,
      interest_healty_eat: null,
      interest_del_food: null,
      interest_cosm_prodt: null,
      interest_tech_elect: null,
      interest_med_optic: null,
      interest_online_cinema: null,
      interest_clth_shoes: null,
      interest_kids_clth_shoes: null,
      interest_learn_sport: null,
      sport_fan: null,
      interest_sport_clth: null,
      interest_sport_club: null,
      interest_home_animal: null,
      interest_fee_medic: null,
      interest_stoma_serv: null,
      interest_online_aptek: null,
      interest_rest_country: null,
      search_system: null,
    }

    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown', size: 'lg' });
    modalRef.componentInstance.data = { user_id: this.currentClient.user_id, contact_id: this.currentClient.contact_id, start_date: '', budget: '', text: '', comment: '', company_name: this.currentClient.company_name, anketa: anketa, terms: false };
    modalRef.componentInstance.regions = this.regions();
    modalRef.componentInstance.edited_anketa = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTargets();
    });
  }

  editData(data: any) {
    data.company_name = this.currentClient.company_name;
    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown', size: 'lg' });
    modalRef.componentInstance.data = { ...data };
    modalRef.componentInstance.regions = this.regions();
    modalRef.componentInstance.edited_anketa = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTargets();
    });
  }

  deleteData(data: any) {
    const modalRef = this.modalService.open(SmsGroupModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.deleted_anketa = true;

    modalRef.result.then((result) => {
      if (result)
        this.getSmsTargets();
    });
  }

  viewData(item: any) {
    this.spinner.show();
    this.Sms.exportSmsTarget(item.id).subscribe(res => {
      this.spinner.hide();
      if (res.size > 0)
        this.fileSaver.save(res, 'sms_target.xlsx');
    }, error => {
      this.spinner.hide();
    });
  }

}

@Component({
  selector: 'app-sms-blacklist',
  templateUrl: './sms-blacklist.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), FormsModule, NgbPagination, TranslateModule]
})
export class SmsBlacklistComponent implements OnInit {

  blacklists = signal<any>([]);
  currentUser: any;
  currentClient: any;
  filter: any;
  currentPage: number;
  totalPage: number;
  pageSize: any;

  constructor(
    private Sms: SmsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || '{}');
    this.filter = { page: 1, value: '', type: '' }
    this.getDataItems();
  }

  getDataItems() {
    this.route.queryParamMap.subscribe((data: any) => {
      if (data.params.page)
        this.getBlacklists(data.params.page);
      else
        this.getBlacklists(1);
    });
  }


  getBlacklists(curPage) {
    this.filter.page = curPage;
    this.Sms.getBlacklist(this.filter).subscribe((res: any) => {
      this.spinner.hide();
      if (res) {
        this.currentPage = res.current_page;
        this.pageSize = res.per_page;
        this.totalPage = res.total;
        this.blacklists.set(res.data);
      }
    })
  }

  pageChanged(page: any) {
    this.spinner.show();
    this.router.navigate(['/sms/blacklist'], { queryParams: { page: page } });
  }

  addData() {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.blacklist = { type: '', keyword: '', client_id: this.currentClient.id };
    modalRef.componentInstance.blacklist_edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

  importBlacklist() {
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.blacklist = { action: 'add', client_id: this.currentClient.id };
    modalRef.componentInstance.blacklist_batch = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

  deleteData(item: any) {
    item.client_id = this.currentClient.id;
    const modalRef = this.modalService.open(SmsTemplateModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.blacklist = item;
    modalRef.componentInstance.blacklist_deleted = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

  search() {
    this.filter.page = 1;
    this.getDataItems();
  }

  searchReset() {
    this.filter = { page: 1, value: '', type: '' }
    this.getDataItems();
  }

}

//Sms settings
@Component({
  selector: 'app-sms-integrate',
  templateUrl: './sms-integrate.component.html',
  styleUrls: [],
  imports: [HeaderComponent, forwardRef(() => SmsMenuComponent), TranslateModule, SafePipe]
})
export class SmsIntegrateComponent implements OnInit {

  data = signal<any>([]);
  types: any;
  dataItems = signal<any>([]);
  currentUser: any;
  curLang: string;
  curUrl: string;
  siteUrl: string;

  constructor(
    private Sms: SmsService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.siteUrl = env.apiUrl;
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.types = [];
    this.getData();
    this.smsIntegration();
  }

  getData() {
    if (localStorage.getItem('currentCompany')) {
      this.Sms.getSetting(localStorage.getItem('currentCompany')).subscribe((res: any) => {
        this.spinner.hide();
        if (res.status == 'success') {
          this.data.set(res.data);
          this.types = [
            {
              logo: 'https://hollihop.0000.uz/style/images/big.png',
              title: 'CRM система для учебных центров',
              title_uz: 'O‘quv markazlari uchun CRM sistema',
              title_oz: 'Ўқув марказлари учун CRM система',
              title_en: 'CRM system for learning centers',
              type: 'hollihop',
              link: 'https://hollihop.0000.uz/api/iframe?appKey=' + this.data().email + '&appSecret=' + this.data().secret_key
            }
          ];
        }
      })
    }
  }

  smsIntegration() {
    this.Sms.smsIntegration().subscribe((res: any) => {
      if (res) {
        this.dataItems.set(res);
      }
    })
  }

  setUrl(link) {
    this.spinner.show();
    this.curUrl = link;
    setTimeout(() => {
      this.spinner.hide();
    }, 1500)
  }

  removeLink() {
    this.curUrl = '';
  }

}

//Sms settings
@Component({
  selector: 'app-sms-menu',
  templateUrl: './sms-menu.html',
  styleUrls: [],
  imports: [RouterLink, RouterLinkActive, TranslateModule]
})
export class SmsMenuComponent implements OnInit {

  currentUser: any;
  is_detailing: boolean;
  is_nick: boolean;
  constructor() { }

  ngOnInit() {
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.is_detailing = true;
    this.is_nick = true;
    if (this.currentUser.role == 'employee' && this.currentUser.detailing)
      this.is_detailing = false;
    if (this.currentUser.role == 'employee' && this.currentUser.nick)
      this.is_nick = false;
  }

}