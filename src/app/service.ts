import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { ProgressHttp } from 'angular-progress-http';
import { environment } from '../environments/environment';
import { SharedService } from './shared';
import { type, platform, release, arch, hostname, totalmem} from 'os';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RequestMethod, ResponseContentType } from '@angular/http/src/enums';

@Injectable()
export class Service {
    private _serverUrl: any;

    constructor(
        private _http: ProgressHttp,
        private _sharedService: SharedService,
        private _cookie: CookieService
    ) {
        this._sharedService.getConfig(false).subscribe(config => {
            this._serverUrl = config.serverUrl;
        });
    }

    checkAuth(): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/auth/getAuth';

        return this._http.get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    get(id: number, serviceName: string, progressListener: any): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/get?id=' + id;

        return this._http.withDownloadProgressListener(progressListener)
                         .get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    getAll(query: any, serviceName: string, progressListener: any) {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(query, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/getAll?query=' + JSON.stringify(query);

        return this._http.withDownloadProgressListener(progressListener)
                         .get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    getAllAndCount(query: any, serviceName: string, progressListener: any) {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(query, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/getAllAndCount?query=' + JSON.stringify(query);

        return this._http.withDownloadProgressListener(progressListener)
                         .get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    save(data: any, serviceName: string, progressListener: any): Observable<any> {
        return this.post(data, serviceName, 'save', progressListener);
    }

    post(data: any, serviceName: string, method: string, progressListener: any): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/' + method;

        return this._http.withUploadProgressListener(progressListener)
                         .post(URL, data, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    fetch(query: any, serviceName: string, method: string, progressListener: any): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/' + method + '?query=' + JSON.stringify(query);

        return this._http.withDownloadProgressListener(progressListener)
                         .get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    upload(data, progressListener) {
        const URL = this._serverUrl + '/uploader/upload';
        const HEADERS = this.getHttpHeaders();
        delete HEADERS['content-type'];

        const OPTIONS = this.createRequestOptions(null, HEADERS);

        return this._http.withUploadProgressListener(progressListener).post(URL, data, OPTIONS)
                         .catch(this.handleError);
    }
    
    report(data: any, type: string, progressListener: any): Observable<any> {
        let headers = this.getHttpHeaders();
        headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        delete headers['x-token'];

        let options = this.createRequestOptions(null, headers);
        options.responseType = 2;

        const URL = 'https://lois.limassentosa.co.id/index.php/' + type;

        return this._http.withUploadProgressListener(progressListener)
                   .post(URL, data, options)
                   
                   .catch(this.handleError);

    }

    delete(id: number, serviceName: string, progressListener: any): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/' + serviceName + '/delete?id=' + id;

        return this._http.withDownloadProgressListener(progressListener)
                         .delete(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    login(data: any, progressListener: any): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/auth/login';
        const INFO = type() + ' ' + platform() + ' ' + release() + ' ' + arch() + ' ' + hostname() + ' ' + totalmem();
        const BODY = { userName: data.userName, password: data.password, agent: INFO };

        return this._http.withUploadProgressListener(progressListener)
                         .post(URL, BODY, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    logout(): Observable<any> {
        const HEADERS = this.getHttpHeaders();
        const OPTIONS = this.createRequestOptions(null, HEADERS);
        const URL = this._serverUrl + '/auth/logout';
       
        return this._http.get(URL, OPTIONS)
                         .map(res => res.json())
                         .catch(this.handleError);
    }

    private createRequestOptions(query: any, headers?: any): RequestOptions {
        let result = new RequestOptions();

        if(headers)
            result.headers = headers;

        if (!query)
            return result;

         let params = new URLSearchParams();

         if(query.limit && query.offset) {
             params.append('limit', query.limit.toString());
             params.append('offset', query.offset.toString());
         }

         if(query.order)
            params.append('order', JSON.stringify(query.order));
         if(query.criteria)
            params.append('criteria', JSON.stringify(query.criteria));

         result.params = params;
  
         return result;
    }

    private getHttpHeaders(): any {
        let identity = this._cookie.getObject('identity');
        let token = null;

        if(identity)
            token = identity['token'];

        return { 'content-type': 'application/json', 'x-token': token};
    }

    private handleError(error: Response | any) {
        console.log(error);
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            if(error.status === 0)
                errMsg = 'Tidak Terhubung Dengan Server';
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}