import { AuthGuard } from './services/auth.guard';
import { NoAuthGuard } from './services/noauth.guard';
import { Routes } from '@angular/router';
import { AuthComponent, PageNotFoundComponent } from './components/auth/auth';
import { EmployeeComponent, LogsComponent } from './components/employee/data';
import { SmsComponent, SmsDetailingComponent, SmsDetailsComponent, SmsTextComponent, SmsSettingsComponent, SmsContactComponent, SmsGroupComponent, SmsTemplateComponent, SmsRequestComponent, SmsPricesComponent, SmsTargetComponent, SmsBlacklistComponent, SmsIntegrateComponent } from './components/sms/sms.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [NoAuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'sms',
    component: SmsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/detailing',
    component: SmsDetailingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/detailing/:id',
    component: SmsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/detail/:slug',
    component: SmsDetailingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/detail/:slug/:id',
    component: SmsDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/texts',
    component: SmsTextComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/contact',
    component: SmsContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/group',
    component: SmsGroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/template',
    component: SmsTemplateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/settings',
    component: SmsSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/request',
    component: SmsRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/prices',
    component: SmsPricesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/target',
    component: SmsTargetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/blacklist',
    component: SmsBlacklistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sms/integrates',
    component: SmsIntegrateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees',
    component: EmployeeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'logs',
    component: LogsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];
