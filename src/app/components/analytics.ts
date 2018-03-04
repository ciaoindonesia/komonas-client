import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';
import { BaseComponent } from './base';
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'komonas-analytics',
  templateUrl: '../templates/analytics.html'
})
export class AnalyticsComponent extends BaseComponent implements OnInit {
	public monthNames:Array<any> = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	public refreshChart: boolean = false;
	public demandPush: any[];
	public supplyPush: any[];
	public timePush: any[];
	supplyDemands: any[];
	provinces: any;
	comodities: any = [];
    selectedProvinceId: any;
	selectedTimeType: any;
	selectedComodityId: any;
	selectedYear: any;
	public lineChartData:Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Supply'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Demand'}
	];
	public lineChartLabels:Array<any> = ['2015','2016','2017','2018'];
	public lineChartOptions:any = {
	responsive: true
	
	
	};
	public lineChartColors:Array<any> = [
	{ // grey
	  backgroundColor: 'rgba(148,159,177,0.2)',
	  borderColor: 'rgba(148,159,177,1)',
	  pointBackgroundColor: 'rgba(148,159,177,1)',
	  pointBorderColor: '#fff',
	  pointHoverBackgroundColor: '#fff',
	  pointHoverBorderColor: 'rgba(148,159,177,0.8)'
	},
	{ // dark grey
	  backgroundColor: 'rgba(225,10,24,0.2)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
	}
	];
	public lineChartLegend:boolean = true;
	public lineChartType:string = 'line';
	
	
	

    constructor(public toastr: ToastsManager, 
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

	ngOnInit(): void {
        this.selectedProvinceId = 'national';
		this.selectedTimeType = 'bulan';
		this.fetchProvinces();
		this.fetchComodities();
		this.selectedComodityId = '';
		this.selectedYear = new Date().getFullYear();
    }

    fetchProvinces(): void {
      this.service.getAll({}, 'province', null).subscribe(
         result => {
           this.provinces = result;
         }
      )
    }
	
	fetchComodities(): void {
      this.service.getAll({}, 'comodity', null).subscribe(
         result => {
           this.comodities = result;
         }
      )
    }
	
	fetchData(): void {
		//this.refreshChart = false;
		if (this.selectedProvinceId === 'national'){
			if (this.selectedTimeType === 'tahun') {
				this.service.fetch({comodityId: this.selectedComodityId}, 'master', 'getSupplyDemandNationalByComodityByYear', null).subscribe(
					result => {
						this.supplyDemands = result;
						this.updateChart();
					},
					error => {}
				);	
			} else {
				this.service.fetch({comodityId: this.selectedComodityId}, 'master', 'getSupplyDemandNationalByComodityByMonth', null).subscribe(
					result => {
						this.supplyDemands = result;
						this.updateChart();
					},
					error => {}
				);	
			}
		} else {
			
			if (this.selectedTimeType === 'tahun') {
				this.service.fetch({comodityId: this.selectedComodityId, provinceId: this.selectedProvinceId}, 'master', 'getSupplyDemandProvinceByComodityByYear', null).subscribe(
					result => {
						this.supplyDemands = result;
						this.updateChart();
					},
					error => {}
				);	
			} else {
				this.service.fetch({comodityId: this.selectedComodityId, provinceId: this.selectedProvinceId}, 'master', 'getSupplyDemandProvinceByComodityByMonth', null).subscribe(
					result => {
						this.supplyDemands = result;
						this.updateChart();
					},
					error => {}
				);	
			}
			
		}
		
    }
	
	public updateChart():void {	
		
		
		this.supplyPush = [];
		this.demandPush = [];
		this.timePush = [];
		
		for (var supplyDemand of this.supplyDemands) {
			if (this.selectedTimeType === 'tahun'){
				this.timePush.push([supplyDemand.year]);
			} else {
				this.timePush.push([this.monthNames[supplyDemand.month]]);
			}
			this.supplyPush.push([supplyDemand.total_supply]);
			this.demandPush.push([supplyDemand.total_demand]);
		}
			
		this.lineChartLabels = this.timePush;
		
		this.lineChartData = [
		{data: this.supplyPush, label: 'Supply'},
		{data: this.demandPush, label: 'Demand'}
		];
		
		
		this.refreshChart = true;
		/*
		let _lineChartData:Array<any> = new Array(this.lineChartData.length);
		for (let i = 0; i < this.lineChartData.length; i++) {
		  _lineChartData[i] = {data: new Array(this.supplyDemands.length), label: this.lineChartData[i].label};
		  var j = 0;
		  for (var supplyDemand of this.supplyDemands) {
			_lineChartData[i].data[j] = supplyDemand.total_demand
			j = j++;
		  }
		}
		this.lineChartData = _lineChartData;
		*/
	}
	
	chartClicked(e: any): void { 
         
    } 
    
    chartHovered(e: any): void { 
         
    }
	
	

    
}