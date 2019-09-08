import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IRole, RoleModel } from '../../../models/security/role.model';
import { RoleService } from '../../../services/security/role.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, RoleService]
})
export class RoleCreateComponent implements OnInit{
    role: IRole;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private roleService:RoleService,
        private notify: NotifyService
    ){
        this.role = new RoleModel();
    }
    
    ngOnInit(){
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Roleos',
                link: '/admin/role/list'
            },{
                title: 'Creación de perfiles',
                active: true
            }
        ]);
        this.activatedRoute.params.subscribe( (params) =>{
            let _id = params['_id'];
            if( _id != '0'){
                this.loadingService.show('Cargando...');
                this.roleService.get(_id)
                .subscribe( (response: IResponse) =>{
                    if( response.result){
                        this.role = <IRole>response.doc;
                    }
                    this.loadingService.hide();
                });
            }
        });
    }
    save(){
        let request:any;
        this.loadingService.show('Guardando...');
        if(!this.role._id)
            request = this.roleService.save(this.role);
        else
            request = this.roleService.update(this.role._id, this.role);
        
        request.subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.notify.success(response.message);
                this.router.navigate(['/admin/role/list']);
            }else{
                this.notify.error(response.message);
            }
        })
    }
}
