import { Component, OnInit, Input, signal, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { env } from '../../../environments/environment';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NgbModal, NgbActiveModal, NgbNavModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../../services/account.service';
import { CountryService } from '../../services/country.service';
import { FilterPipe, TimePipe } from '../../directive/filter';
import { MatchPasswordDirective } from '../../directive/match-password.directive';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-modal.component.html',
  imports: [FormsModule, MatchPasswordDirective, TranslateModule, FilterPipe, TimePipe]
})

export class ProfileModal implements OnInit {
  activeModal = inject(NgbActiveModal);
  private Account = inject(AccountService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private translate = inject(TranslateService);

  @Input() user;

  viewed: boolean;
  register: boolean;
  change_pass: boolean;
  password_success_changed: string;
  countries: any;
  confirmPassword: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() { }

  ngOnInit() {
    this.translate.get(['password_success_changed']).subscribe((item: any) => {
      this.password_success_changed = item['password_success_changed'];
    });
    var country_data: any = localStorage.getItem('countries');
    this.countries = JSON.parse(country_data);
  }

  changedPassword() {
    this.spinner.show();
    this.Account.changePassword(this.user).subscribe(
      data => {
        if (data) {
          this.spinner.hide();
          this.activeModal.close();
          this.toastr.success(this.password_success_changed);
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
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgbNavModule, RouterLink, FormsModule, NgClass, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, RouterLinkActive, NgxSpinnerModule, DecimalPipe, TranslateModule]
})
export class HeaderComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private modalService = inject(NgbModal);
  private spinner = inject(NgxSpinnerService);
  private Account = inject(AccountService);
  private translate = inject(TranslateService);
  private Country = inject(CountryService);

  isAuthenticated = false;
  currentUser: any;
  siteUrl: string;
  smsActive: string;
  navbarToggle: boolean;
  panelUserToggle: boolean;
  panelLangToggle: boolean;
  panelBalanceToggle: boolean;
  sidebarToggle: boolean;
  curLang: string;
  logout_success: string;
  public pusher: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.router.events.subscribe((e: any) => {
      const navSuccess = e instanceof NavigationEnd;
      if (!(navSuccess))
        return;

      window.scrollTo(0, 0);
      this.smsActive = 'active';

      if (navSuccess && e.url != '/') {
        this.navbarToggle = false;
        this.sidebarToggle = false;

        if (e.url == '/employees' || e.url == '/logs')
          this.smsActive = '';

        if (!this.auth.isAuthenticated() || !localStorage.getItem('SD'))
          this.onLogout();
      }
    })
  }

  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
    if (this.auth.isAuthenticated()) {
      var user: any = localStorage.getItem('SD');
      this.currentUser = JSON.parse(decodeURIComponent(escape(atob(user))));
    }
    this.siteUrl = env.apiUrl;
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.translate.get(['you_logout']).subscribe((item: any) => {
      this.logout_success = item['you_logout'];
    });
  }

  switchLang(lang) {
    localStorage.removeItem('translateRU');
    localStorage.removeItem('translateOZ');
    localStorage.removeItem('translateUZ');
    localStorage.removeItem('translateEN');
    this.spinner.show();
    localStorage.setItem('curLang', lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.curLang = lang;
    this.Country.getCountries(lang).subscribe(
      data => {
        localStorage.setItem('countries', JSON.stringify(data));
      }
    )
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  onLogout() {
    this.spinner.show();
    localStorage.removeItem('translateRU');
    localStorage.removeItem('translateOZ');
    localStorage.removeItem('translateUZ');
    localStorage.removeItem('translateEN');
    localStorage.removeItem('user_status');
    localStorage.removeItem('backview');
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('currentClient');
    this.auth.logout();
  }

  changePass() {
    const modalRef = this.modalService.open(ProfileModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.user = this.currentUser;
    modalRef.componentInstance.change_pass = true;
  }

  viewCurUser() {
    const modalRef = this.modalService.open(ProfileModal, { backdrop: 'static', windowClass: 'animated fadeInDown' });
    modalRef.componentInstance.user = this.currentUser;
    modalRef.componentInstance.viewed = true;
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

}