import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Service } from '../service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BaseComponent } from './base';

@Component({
  selector: 'komonas-login',
  templateUrl: '../templates/login.html'
})
export class LoginComponent extends BaseComponent implements OnInit {
    user: any;

    constructor(private _cookie: CookieService, 
                private _router: Router,
                protected service: Service,    
                protected vcr: ViewContainerRef,
                public toastr: ToastsManager) {

       super(service, toastr, vcr);
    }

    ngOnInit(): void {
        this.user = { userName: null, password: null };
    }

    login(): void {
      if(!this.user.userName || this.user.userName.trim() === '') {
          this.toastr.error('Silahkan Isi Username');
          return;
      }

      if(!this.user.password || this.user.password.trim() === '') {
          this.toastr.error('Silahkan Isi Password');
          return;
      }

      this.service.login(this.user, this.progressListener.bind(this)).subscribe (
          result => {
            this._cookie.putObject('identity', result.identity);    
            this._router.navigateByUrl('main/dashboard');
          },
          error => {
            this.toastr.error('Tidak Dapat Melakukan Login');
          }
       )
    }
}
