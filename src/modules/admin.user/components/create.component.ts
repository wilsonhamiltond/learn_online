import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IUser, UserModel } from '../../../models/security/user.model';
import { UserService } from '../../../services/security/user.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { CatalogService } from '../../../services/security/catalog.service';
import { forkJoin } from 'rxjs';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, UserService, CatalogService]
})
export class UserCreateComponent implements OnInit{
    user: IUser;
    statues:ICatalog[] = [];
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private userService:UserService,
        private notify: NotifyService,
        private catalogService: CatalogService
    ){}
    
    ngOnInit(){
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Usuario',
                link: '/admin/user/list'
            },{
                title: 'Creación de usuarios',
                active: true
            }
        ]);
        this.activatedRoute.params.subscribe( (params) =>{
            let _id = params['_id'],
                requests = [
                    this.catalogService.user_status()
                ];
            if( _id != '0')
                requests.push(this.userService.get(_id, true))
            else{
                this.user = new UserModel();
            }

            this.loadingService.show('Cargando...');
                
            forkJoin(requests).subscribe( (responses: IResponse[]) =>{
                this.statues = responses[0].docs;
                if(_id != '0' &&  responses[1].result){
                    this.user = <IUser>responses[1].doc;
                    delete this.user.password;
                }
                this.loadingService.hide();
            });
        });
    }
    save(){
        let request:any,
            user = Object.assign({}, this.user);

        this.loadingService.show('Guardando...');
        if(!this.user._id)
            request = this.userService.save(user);
        else
            request = this.userService.update(user._id, user);
        
        request.subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.notify.success(response.message);
                this.router.navigate(['/admin/user/list']);
            }else{
                this.notify.error(response.message);
            }
        })
    }
}
