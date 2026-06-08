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
    this.data.access = 'inactive';
    this.DataApi.updateData(this.data).subscribe(
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
    modalRef.componentInstance.data = { phone_ext: 998, phone: '', name: '', access: 'active', password: '', role: 'employee', department: '' };
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
  imports: [HeaderComponent, TranslateModule, FormsModule, NgbPagination, FilterPipe, TimePipe]
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
  curLang: any;

  constructor(
    private DataApi: EmployeeService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('SD') || '{}'))));
    this.curLang = localStorage.getItem('curLang');

    if (this.currentUser.role != 'employee')
      this.is_access = true;

    this.actions = [
      { 
        'title_ru': 'Отправлена массовая рассылка',
        'title_uz': 'Ommaviy xabar yuborildi',
        'title_oz': 'Оммавий хабар юборилди',
        'title_en': 'Bulk message sent',
        'val': 'send_mailing', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Отправлено СМС',
        'title_uz': 'SMS yuborildi',
        'title_oz': 'СМС юборилди',
        'title_en': 'SMS sent',
        'val': 'send_single', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Отменена рассылка',
        'title_uz': 'Ommaviy xabar yuborish bekor qilindi',
        'title_oz': 'Оммавий хабар юбориш бекор қилинди',
        'title_en': 'Campaign canceled',
        'val': 'cancel_mailing', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Добавлен контакт',
        'title_uz': 'Kontakt qo\'shildi',
        'title_oz': 'Контакт қўшилди',
        'title_en': 'Contact added',
        'val': 'add_contact', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Импортированы контакты', 
        'title_uz': 'Kontaktlar import qilindi',
        'title_oz': 'Контактлар импорт қилинди',
        'title_en': 'Contacts imported',
        'val': 'import_contact', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Изменен контакт', 
        'title_uz': 'Kontakt o\'zgartirildi',
        'title_oz': 'Контакт ўзгартирилди',
        'title_en': 'Contact edited',
        'val': 'edit_contact', 'color': 'badge bg-warning' 
      },
      { 
        'title_ru': 'Удален контакт', 
        'title_uz': 'Kontakt o\'chirildi',
        'title_oz': 'Контакт ўчирилди',
        'title_en': 'Contact deleted',
        'val': 'delete_contact', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Удалено несколько контактов', 
        'title_uz': 'Bir nechta kontaktlar o\'chirildi',
        'title_oz': 'Бир нечта контактлар ўчирилди',
        'title_en': 'Multiple contacts deleted',
        'val': 'delete_contacts', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Удалены все контакты', 
        'title_uz': 'Barcha kontaktlar o\'chirildi',
        'title_oz': 'Барча контактлар ўчирилди',
        'title_en': 'All contacts deleted',
        'val': 'delete_contacts_all', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Добавлен текст', 
        'title_uz': 'Matn qo\'shildi',
        'title_oz': 'Матн қўшилди',
        'title_en': 'Text added',
        'val': 'add_text', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Изменен текст', 
        'title_uz': 'Matn o\'zgartirildi',
        'title_oz': 'Матн ўзгартирилди',
        'title_en': 'Text edited',
        'val': 'edit_text', 'color': 'badge bg-warning' 
      },
      { 
        'title_ru': 'Удален текст', 
        'title_uz': 'Matn o\'chirildi',
        'title_oz': 'Матн ўчирилди',
        'title_en': 'Text deleted',
        'val': 'remove_text', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Удалены все группы', 
        'title_uz': 'Barcha guruhlar o\'chirildi',
        'title_oz': 'Барча гуруҳлар ўчирилди',
        'title_en': 'All groups deleted',
        'val': 'delete_group_all', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Удалена группа', 
        'title_uz': 'Guruh o\'chirildi',
        'title_oz': 'Гуруҳ ўчирилди',
        'title_en': 'Group deleted',
        'val': 'delete_group', 'color': 'badge bg-danger' 
      },
      { 
        'title_ru': 'Создана группа', 
        'title_uz': 'Guruh yaratildi',
        'title_oz': 'Гуруҳ яратилди',
        'title_en': 'Group added',
        'val': 'add_group', 'color': 'badge bg-primary' 
      },
      { 
        'title_ru': 'Изменена группа', 
        'title_uz': 'Guruh o\'zgartirildi',
        'title_oz': 'Гуруҳ ўзгартирилди',
        'title_en': 'Group edited',
        'val': 'edit_group', 'color': 'badge bg-warning' 
      },
      { 
        'title_ru': 'Добавлена заявка на ник', 
        'title_uz': 'Nik uchun ariza yaratildi',
        'title_oz': 'Ник учун ариза яратилди',
        'title_en': 'Nickname request added',
        'val': 'patch_anketa', 'color': 'badge bg-primary' 
      },
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