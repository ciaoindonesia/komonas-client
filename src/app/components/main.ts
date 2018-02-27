import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Service } from '../service';
import { Router } from '@angular/router';

@Component({
  selector: 'komonas-main',
  templateUrl: '../templates/main.html'
})
export class MainComponent implements OnInit {
    identity: any;
    access: any;

    constructor(private _cookie: CookieService, 
                private _service: Service, 
                private _router: Router) {}

    ngOnInit(): void {
       this.identity = this._cookie.getObject('identity'); 
       this.loadAccesses();
    }

    loadAccesses(): void {
       this._service.fetch({}, 'auth', 'getAccesses', null).subscribe(
            result => {
                this.access = result;
            },
            error => {}
        )
    }

    logout(): void {
      this._service.logout().subscribe(
           result => {
              this._cookie.removeAll();
              this._router.navigateByUrl('login');
          },
          error => {}
       )
    }
}
