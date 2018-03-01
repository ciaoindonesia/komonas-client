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
    supplyDemands: any[];
    provinces: any[];
    selectedProvinceId: any;
    selectedMonth: any;
    selectedYear: any;

    constructor(public toastr: ToastsManager, 
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

    ngOnInit(): void {
       this.supplyDemands = [];
       this.selectedProvinceId = 'national';
       this.selectedMonth = new Date().getMonth() + 1;
       this.selectedYear = new Date().getFullYear();

       this.fetchProvinces();
       this.fetchDataByProvince();
    }

    fetchProvinces(): void {
      this.service.getAll({}, 'province', null).subscribe(
         result => {
           this.provinces = result;
         }
      )
    }

    fetchData(): void {
		if (this.selectedMonth === 'tahun'){
			this.service.fetch({year: this.selectedYear}, 'master', 'getSupplyDemandNationalByYear', null).subscribe(
				result => {
					this.supplyDemands = result;
				},
				error => {}
			);
			return;
		}
		
		this.service.fetch({month: this.selectedMonth, year: this.selectedYear}, 'master', 'getSupplyDemandNational', null).subscribe(
		   result => {
			  this.supplyDemands = result;
		   },
		   error => {}
		);
    }

    fetchDataByProvince(): void {
       if (this.selectedProvinceId === 'national') {
          this.fetchData();
          return;
       }
	   
	   if (this.selectedMonth === 'tahun'){
			this.service.fetch({provinceId: this.selectedProvinceId, year: this.selectedYear}, 'master', 'getSupplyDemandByProvinceByYear', null).subscribe(
				result => {
					this.supplyDemands = result;
				},
				error => {}
			);
			return;
		}

       this.service.fetch({provinceId: this.selectedProvinceId, month: this.selectedMonth, year: this.selectedYear}, 'master', 'getSupplyDemandByProvince', null).subscribe(
          result => {
            this.supplyDemands = result;
          },
          error => {

          }
       )
    }
}
