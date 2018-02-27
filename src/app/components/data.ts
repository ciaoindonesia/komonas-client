import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';
import { BaseComponent } from './base';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'komonas-data',
  templateUrl: '../templates/data.html'
})
export class DataComponent extends BaseComponent implements OnInit {
    viewType: string;

    constructor(public toastr: ToastsManager, 
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

    ngOnInit(): void {
        this.serviceName = 'master';
        this.viewType = 'list';
        this.entities = [];
        this.entity = {};
        this.query.criteria = { comodity: null, kabupaten: null, status: '' };
        this.filter();
    }

    add(): void {
      this.entity = {};
      this.viewType = 'form';
    }

    edit(entity): void {
      this.entity = entity;
      this.viewType = 'form';
    }

    save(): void {
        if (!this.entity.kabupaten || !this.entity.comodity || isNaN(this.entity.quantity) || !this.entity.status) {
            this.toastr.info('Silahkan isi data yang bertanda (*)');
            return;
        }

        this.progress.percentage = 0;

        this.service.save(this.entity, this.serviceName, this.progressListener.bind(this)).subscribe(
          result => {
             this.toastr.success('Data berhasil disimpan');
             this.entity = {};
          },
          error => {
              this.toastr.error('Data gagal disimpan');
          }
        )
    }

    delete(id): void {
        let confirmed = confirm('Data akan dihapus, anda yakin?');

        if (!confirmed)
        return;
      
        this.progress.percentage = 0;

        this.service.delete(id, this.serviceName, this.progressListener.bind(this)).subscribe(
          result => {
              this.toastr.success('Data berhasil dihapus');
              this.filter();
          },
          error => {
              this.toastr.error('Data gagal dihapus');
          }
        );
    }

    loadKabupatens(keyword: any): Observable<any> {
      return this.service.getAll({criteria: { name: keyword }, order: [{field: 'id', order: 'ASC'}]}, 
          'kabupaten', null).map(e => e);
    }

    loadComodities(keyword: any): Observable<any> {
        return this.service.getAll({criteria: { name: keyword }, order: [{field: 'id', order: 'ASC'}]}, 
            'comodity', null).map(e => e);
    }

    backToList(): void {
      this.entity = {};
      this.viewType = 'list';
      this.filter();
    }
}
