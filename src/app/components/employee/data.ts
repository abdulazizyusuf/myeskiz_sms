import { Component, OnInit, Input, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbActiveModal, NgbTooltip, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { env } from '../../../environments/environment';
import { EmployeeService } from '../../services/employee.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPipe } from '../../directive/filter';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { NgxMaskDirective } from 'ngx-mask';
import { FilterPipe, TimePipe } from '../../directive/filter';

@Component({
  selector: 'app-employee-modal',
  templateUrl: './modal.html',
  imports: [FormsModule, NgxMaskDirective, TranslateModule]
})

export class EmployeeModal implements OnInit {
  @Input() data: any;

  deleted: boolean;
  edited: boolean;
  siteUrl: string;
  numberFormat: string;
  phone_flag: string = 'uz';

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private DataApi: EmployeeService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.numberFormat = '99999999999';
    this.siteUrl = env.apiUrl;
  }

  patchData() {
    this.spinner.show();
    if (this.data.id) {
      this.DataApi.updateData(this.data).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.data);
            this.toastr.success('Успешно редактировано');
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.DataApi.createData(this.data).subscribe(
        data => {
          if (data) {
            this.spinner.hide();
            this.activeModal.close(this.data);
            this.toastr.success('Успешно добавлен');
          }
        },
        error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  deleteData() {
    this.spinner.show();
    this.DataApi.deleteData(this.data).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.toastr.success('Успешно удалено');
          this.activeModal.close(this.data);
        }
      },
      error => {
        this.spinner.hide();
        this.toastr.error(error.error.message);
      }
    );
  }

  randomPassword() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    this.data.password = text;
  }

}

@Component({
  selector: 'app-employee',
  templateUrl: './data.html',
  styleUrls: [],
  imports: [HeaderComponent, TranslateModule, FormsModule, NgbTooltip, DatePipe, SearchPipe]
})

export class EmployeeComponent implements OnInit {

  dataItems = signal<any>([]);
  currentUser: any;
  searching: string = '';
  is_access: boolean;

  constructor(
    private DataApi: EmployeeService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    var date = new Date();
    var year = date.getFullYear();
    this.spinner.show();
    this.is_access = true;
    this.getDataItems();
  }

  getDataItems() {
    this.DataApi.getDataItems().subscribe(data => {
      this.spinner.hide();
      if (data) {
        this.dataItems.set(data);
      }
    })
  }

  addData() {
    const modalRef = this.modalService.open(EmployeeModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.data = { no: '', date: '', company: '', type: 'outcome' };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

  editData(data: any) {
    const modalRef = this.modalService.open(EmployeeModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.data = { ...data };
    modalRef.componentInstance.edited = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

  deleteData(data: any) {
    const modalRef = this.modalService.open(EmployeeModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.data = { ...data };
    modalRef.componentInstance.deleted = true;

    modalRef.result.then((result) => {
      if (result)
        this.getDataItems();
    });
  }

}


@Component({
  selector: 'app-logs-list',
  templateUrl: './logs.html',
  styleUrls: [],
  imports: [HeaderComponent, TranslateModule, FormsModule, NgbTooltip, NgbPagination, FilterPipe, TimePipe]
})

export class LogsComponent implements OnInit {

  logs = signal<any>([]);
  actions: any;
  currentUser: any;
  filter: any;
  users = signal<any>([]);
  currentPage: number;
  totalPage: number;
  pageSize: any;
  is_access: boolean;

  constructor(
    private DataApi: EmployeeService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));

    if (this.currentUser.role != 'employee')
      this.is_access = true;

    this.actions = [
      { 'title': 'Массовая рассылка', 'val': 'send_mailing', 'color': 'badge bg-primary' },
      { 'title': 'Отправлено СМС', 'val': 'send_single', 'color': 'badge bg-primary' },
      { 'title': 'Отменено рассылка', 'val': 'cancel_mailing', 'color': 'badge bg-danger' },
      { 'title': 'Добалено контакт', 'val': 'add_contact', 'color': 'badge bg-primary' },
      { 'title': 'Импортировано контакты', 'val': 'import_contact', 'color': 'badge bg-primary' },
      { 'title': 'Изменено контакт', 'val': 'edit_contact', 'color': 'badge bg-warning' },
      { 'title': 'Удалено контакт', 'val': 'delete_contact', 'color': 'badge bg-danger' },
      { 'title': 'Удалено несколько контактов', 'val': 'delete_contacts', 'color': 'badge bg-danger' },
      { 'title': 'Удалено все контакты', 'val': 'delete_contacts_all', 'color': 'badge bg-danger' },
      { 'title': 'Добавлено текст', 'val': 'add_text', 'color': 'badge bg-primary' },
      { 'title': 'Изменено текст', 'val': 'edit_text', 'color': 'badge bg-warning' },
      { 'title': 'Удалено текст', 'val': 'remove_text', 'color': 'badge bg-danger' },
      { 'title': 'Удалено все группы', 'val': 'delete_group_all', 'color': 'badge bg-danger' },
      { 'title': 'Удалено группа', 'val': 'delete_group', 'color': 'badge bg-danger' },
      { 'title': 'Добавлено группа', 'val': 'add_group', 'color': 'badge bg-primary' },
      { 'title': 'Изменено группа', 'val': 'edit_group', 'color': 'badge bg-warning' },
      { 'title': 'Добавлено заявка на ник', 'val': 'patch_anketa', 'color': 'badge bg-primary' },
    ];

    this.getFilter();

    if (this.is_access) {
      this.getDataItems();
      this.DataApi.getDataItems().subscribe((res: any) => {
        if (res) {
          this.users.set(res);
        }
      })
    }
  }

  getDataItems() {
    this.route.queryParamMap.subscribe((data: any) => {
      if (data.params.page)
        this.getData(data.params.page);
      else
        this.getData(1);
    });
  }

  getData(curPage) {
    this.spinner.show();
    this.filter.page = curPage;
    this.DataApi.logs(this.filter).subscribe((res: any) => {
      if (res.result) {
        this.logs.set(res.result.data);
        this.currentPage = res.result.current_page;
        this.pageSize = res.result.per_page;
        this.totalPage = res.result.total;
        this.spinner.hide();
      }
    })
  }

  pageChanged(page) {
    this.spinner.show();
    this.router.navigate(['/logs'], { queryParams: { page: page } });
  }

  searchReset() {
    this.getFilter();
    this.getData(1);
  }

  getFilter() {
    this.filter = {
      action: '',
      user_id: '',
      date_from: '',
      date_to: '',
    }
  }

}