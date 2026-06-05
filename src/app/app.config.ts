import { ApplicationConfig, provideBrowserGlobalErrorListeners, enableProdMode, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routes';
import { env } from '../environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './services/token.interceptor';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AsyncTranslate } from './services/translations.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

if (env.production) {
  enableProdMode();
}
registerLocaleData(localeRu);

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentNgxMask(),
    importProvidersFrom(
      FormsModule,
      NgxSelectModule,
      NgbModule,
      ToastrModule.forRoot(),
      NgxSpinnerModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: AsyncTranslate
        }
      }),
      NgxDocViewerModule
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'ru-RU' }
  ],
};
