import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { ICatalog, CatalogModel } from '../../../models/security/catalog.model';
import { CatalogService } from '../../../services/security/catalog.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, CatalogService]
})
export class CatalogCreateComponent implements OnInit{
    catalog: ICatalog;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private catalogService:CatalogService,
        private notify: NotifyService
    ){
        this.catalog = new CatalogModel();
    }
    
    ngOnInit(){
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Catalogos',
                link: '/admin/catalog/list'
            },{
                title: 'Creación de catalogos',
                active: true
            }
        ]);
        this.activatedRoute.params.subscribe( (params) =>{
            let _id = params['_id'];
            if( _id != '0'){
                this.loadingService.show('Cargando...');
                this.catalogService.get(_id)
                .subscribe( (response: IResponse) =>{
                    if( response.result){
                        this.catalog = <ICatalog>response.doc;
                    }
                    this.loadingService.hide();
                });
            }
        });
    }
    save(){
        let request:any;
        this.loadingService.show('Guardando...');
        if(!this.catalog._id)
            request = this.catalogService.save(this.catalog);
        else
            request = this.catalogService.update(this.catalog._id, this.catalog);
        
        request.subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.notify.success(response.message);
                this.router.navigate(['/admin/catalog/list']);
            }else{
                this.notify.error(response.message);
            }
        })
    }
}
