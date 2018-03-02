import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProgressHttpModule } from 'angular-progress-http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { Service } from './service';
import { SharedService } from './shared';
import { CookieService } from 'angular2-cookie';

import { AppComponent } from './components/app';
import { LoginComponent } from './components/login';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MainComponent } from './components/main';
import { DashboardComponent } from './components/dashboard';
import { ProvinceComponent } from './components/province';
import { KabupatenComponent } from './components/kabupaten';
import { ComodityComponent } from './components/comodity';
import { UserComponent } from './components/user';
import { DataComponent } from './components/data';

import { Ng2OrderModule } from 'ng2-order-pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DashboardComponent,
    ProvinceComponent,
    KabupatenComponent,
    ComodityComponent,
    DataComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
	Ng2OrderModule,
    BrowserAnimationsModule,
    HttpModule,
    ProgressHttpModule,
    FormsModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    ToastModule.forRoot(),
    NguiAutoCompleteModule.forRoot(),
    RouterModule.forRoot([
        { path: '', redirectTo: 'main/dashboard', pathMatch: 'full'},
        { path: 'login', component: LoginComponent },
        { path: 'main', component: MainComponent, children: [
          { path: 'dashboard', component: DashboardComponent },
          { path: 'provinsi', component: ProvinceComponent },
          { path: 'kabupaten', component: KabupatenComponent },
          { path: 'komoditas', component: ComodityComponent },
          { path: 'data', component: DataComponent },
          { path: 'pengguna', component: UserComponent }
        ]},
    ])
  ],
  providers: [Service, SharedService, CookieService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
