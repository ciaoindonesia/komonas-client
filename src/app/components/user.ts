import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';
import { BaseComponent } from './base';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'komonas-user',
  templateUrl: '../templates/user.html'
})
export class UserComponent extends BaseComponent implements OnInit {
    viewType: string;

    constructor(public toastr: ToastsManager, 
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

    ngOnInit(): void {
        this.serviceName = 'user';
        this.viewType = 'list';
        this.entities = [];
        this.entity = {};
        this.query.criteria = { name: null };
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
        if (!this.entity.name) {
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

    backToList(): void {
      this.entity = {};
      this.viewType = 'list';
      this.filter();
    }
}
