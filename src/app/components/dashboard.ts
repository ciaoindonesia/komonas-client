import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';
import { BaseComponent } from './base';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'komonas-dashboard',
  templateUrl: '../templates/dashboard.html'
})
export class DashboardComponent extends BaseComponent implements OnInit {
    totalKabupaten: number;
    totalProvince: number;
    totalComodity: number;

    provinces: any[];
    kabupatens: any[];
    comodities: any[];

    constructor(public toastr: ToastsManager, 
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

    ngOnInit(): void {
       this.totalComodity = 0;
       this.totalKabupaten = 0;
       this.totalProvince = 0;

       this.fetchData();
    }

    fetchData(): void {
       this.service.fetch({}, 'kabupaten', 'getAll', null).subscribe(
           result => {
              this.totalKabupaten = result.length;
              this.kabupatens = result;
           },
           error => {}
       );
       this.service.fetch({}, 'province', 'getAll', null).subscribe(
            result => {
              this.totalProvince = result.length;
              this.provinces = result;
            },
            error => {}
       );

       this.service.fetch({}, 'comodity', 'getAll', null).subscribe(
            result => {
              this.totalComodity = result.length;
              this.comodities = result;
            },
            error => {}
       );
    }
}
