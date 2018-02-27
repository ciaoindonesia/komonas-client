import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Router } from '@angular/router';
import { Service } from '../service';

@Component({
   selector: 'komonas',
   templateUrl: '../templates/app.html'
})
export class AppComponent {

  constructor(private _service: Service,  
              private _cookie: CookieService, 
              private _router: Router) { }

  ngOnInit(): void { 
    this.checkAuth();
  }

  ngOnDestroy(): void { }

  checkAuth(): void {
    this._service.checkAuth().subscribe(
       result => {
         if(this._router.url !== '/login')
            this._router.navigateByUrl(this._router.url);
         else
            this._router.navigateByUrl('/main/dashboard');
       },
       error => {
         this._router.navigateByUrl('login');
       }
    )
  }
}
