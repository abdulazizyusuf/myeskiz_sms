import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrls: ['./app.css'],
    imports: [RouterOutlet],
    standalone: true
})
export class App {
	private translate = inject(TranslateService);

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);


	constructor() {
    if(!localStorage.getItem('curLang')){
      localStorage.setItem('curLang','ru');
      this.defaultTranslate('ru');
    }
    
		if(localStorage.getItem('curLang')){
      let lang = localStorage.getItem('curLang');
      this.defaultTranslate(lang);
    } 
	}

	defaultTranslate(lang){
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

}
