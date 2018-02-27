import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';
import { BaseComponent } from './base';
import { ToastsManager } from 'ng2-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'komonas-comodity',
  templateUrl: '../templates/comodity.html'
})
export class ComodityComponent extends BaseComponent implements OnInit {
    viewType: string;
    files: any;

    constructor(public toastr: ToastsManager, 
        public sanitizer: DomSanitizer,
        protected service: Service, 
        protected vcr: ViewContainerRef,
        private _cookie: CookieService) { 
          super(service, toastr, vcr);
        }

    ngOnInit(): void {
        this.serviceName = 'comodity';
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

    fileChange(event) {
      this.files = event.target.files;
      this.entity.photoPath = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.files[0]));
    }

    upload(): void {
        const fileList: FileList = this.files;
        
        if (fileList.length > 0) {
          const file: File = fileList[0];
          const formData: FormData = new FormData();
          
          formData.append('file', file, file.name);

          this.service.upload(formData, this.progressListener.bind(this)).subscribe(
              result => {
                  this.entity.imagePath = result['_body'];
                  this.toastr.success('Foto Berhasil Diupload');
              },
              error => {
                this.toastr.error('Foto Gagal Diupload');
              }
          );
        }
        else {
          this.toastr.info('Harap Pilih Foto Sebelum Mengupload');
        }
    }

    backToList(): void {
      this.entity = {};
      this.viewType = 'list';
      this.filter();
    }
}
