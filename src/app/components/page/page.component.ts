import { Component, OnInit } from '@angular/core';
import { env } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-page-sms',
  templateUrl: './sms.component.html',
  styleUrls: [],
  imports: [HeaderComponent, TranslateModule]
})

export class PageSmsComponent implements OnInit {

  siteUrl: string;
  curLang: string;

  constructor() { }

  ngOnInit() {
    this.curLang = localStorage.getItem('curLang') || 'ru';
    this.siteUrl = env.apiUrl;
  }

}
