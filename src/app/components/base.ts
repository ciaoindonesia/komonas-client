import { ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Service } from '../service';
import { Progress } from 'angular-progress-http';

export class BaseComponent {
    public progress: Progress;
    public query: any;
    public paging: any;
    public entities: any[];
    public entity: any;

    protected service: Service;
    protected serviceName: string;
    
    constructor(service: Service, toastr: ToastsManager, vcr: ViewContainerRef) {
        toastr.setRootViewContainerRef(vcr);

        this.service = service;

        this.progress = {
            event: null,
            loaded: 0,
            percentage: 100,
            total: 0,
            lengthComputable: true
        };

        this.paging = { page: 1, max: 10, total: 0 };

        this.query = { criteria: {} };
    }

    filter(): void {
        this.paging.page = 1;
        this.load();
    }

    load(): void {
        this.progress.percentage = 0;
        this.query.limit = this.paging.max;
        this.query.offset = (this.paging.page - 1) * this.paging.max;
        
        this.resetReferenceQuery();
        this.createCriteria();

        this.service.getAllAndCount(this.query, this.serviceName, this.progressListener.bind(this)).subscribe(
            result => {
                this.entities = result.rows;
                this.paging.total = result.count;
            },
            error => {
                console.log(error);
            }
        )
    }

    createCriteria(): void {
        let keys = Object.keys(this.query.criteria);

        for(let i=0; i<keys.length; i++) {
            let key = keys[i];

            if(this.query.criteria[key] && this.query.criteria[key]['id']) {
                if(this.query.criteria[key] instanceof String && this.query.criteria[key].trim() === '') {
                     delete this.query.criteria[key];
                     this.query.criteria[key + 'Id'] = null;
                }
                else
                    this.query.criteria[key + 'Id'] = this.query.criteria[key]['id'];
            }
        }
    }

    resetReferenceQuery(): void {}

    search(modal?: any): void {
        this.filter();
        
        if(modal)
            modal.hide();
    }

    page(event): void {
        this.paging.page = event;
        this.load();
    }

    listFormatter(data): string {
        if(!data)
            return;

        return data['name'];
    }


    progressListener(progress) {
        this.progress = progress;
    }
}