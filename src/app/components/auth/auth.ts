import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { env } from '../../../environments/environment';
import { AccountService } from '../../services/account.service';
import { CountryService } from '../../services/country.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./auth.css'],
  imports: [FormsModule, TranslateModule, NgxSpinnerModule]
})
export class AuthComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private Account = inject(AccountService);
  private Country = inject(CountryService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private translate = inject(TranslateService);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    localStorage.removeItem('translateRU');
    localStorage.removeItem('translateOZ');
    localStorage.removeItem('translateUZ');
    localStorage.removeItem('translateEN');
    localStorage.removeItem('SD');
    localStorage.removeItem('user_status');
    localStorage.removeItem('backview');
  }

  loginData: any;
  siteUrl: string;
  phone_flag: string;
  curLang: string;
  countries: any;
  authContent: boolean;
  emailBusy: boolean;
  emailFree: boolean;
  langSwitch: boolean;
  login_success: string;

  ngOnInit() {
    this.authContent = true;
    this.langSwitch = true;
    this.siteUrl = env.apiUrl;
    this.loginData = { lang: '', email: '', password: '' };
    this.phone_flag = 'uz';
    this.spinner.hide();
  }

  langSwitchs(lang) {
    localStorage.setItem('curLang', lang);
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.curLang = lang;

    this.translate.get(['you_login_success']).subscribe((item: any) => {
      this.login_success = item['you_login_success'];
    });

    this.Country.getCountries(lang).subscribe(
      data => {
        this.countries = data;
        localStorage.setItem('countries', JSON.stringify(data));
      }
    )
  }

  switchLang(lang) {
    this.spinner.show();
    this.langSwitchs(lang);
    this.langSwitch = false;
    setTimeout(() => {
      this.spinner.hide();
    }, 1000)
  }

  signIn() {
    if (this.loginData.password.length > 36) {
      this.toastr.error('Password no more length than 36 letters and digits')
    } else {
      this.spinner.show();
      this.auth.login(this.loginData).subscribe(
        (res: any) => {
          this.toastr.success(this.login_success);
          this.router.navigate(['/sms']);
        },
        error => {
          this.spinner.hide();
          this.toastr.error(error.error.message);
        }
      );
    }
  }

}

@Component({
  selector: 'app-not-found',
  templateUrl: './not_found.component.html',
  imports: [HeaderComponent, TranslateModule]
})

export class PageNotFoundComponent {

  constructor() { }

}