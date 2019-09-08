import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../services/security/user.service';
import { UserModel, IUser } from '../../../models/security/user.model';
import { LoadingService } from '../../../services/utils/loading.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { NotifyService } from '../../../services/utils/notify.service';
import { IResponse } from '../../../models/utils/response.model';

@Component({
  selector: 'recover',
  styles: [`
    form div.form-group input{
        padding-left: 40px;
        border-radius: 0;
        height: 48px;
        border: 0;
        font-size: 14pt;
        box-shadow: 0px 0px 2px 1px #808080;
    }
    form div.form-group span{
        color: white;
        padding: 5px 15px;
    }
    form div.form-group input:hover{
        box-shadow: 0px 0px 2px 1px #1abc9c;
    }
    form div.form-group > .material-icons{    
        margin-left: 0px;
        font-size: 17pt;
        position: absolute;
        margin-left: 10px;
        margin-top: 13px;
        color: gray;
    }
    .body{
        padding: 10px 16px;
    }
    .body button{
        border-radius: 2px;
    }
    .body button i{
        font-size: 13pt;
    }
    .separators{
        display: flex;
    }
    .separators span{
        margin-top: 7px;
        padding: 0 10px;
    }
    .separators .separator{
        border-top: 1px solid #d3d3d3;
        margin-top:16px;
        margin-bottom: 6;
        flex-grow: 2;
    }
    .btn-facebook{
        color: #fff;
        background-color: #286090;
        border-color: #204d74;
    }
    .btn-facebook:hover{
        color: #286090;
    }
    .btn-facebook:hover:before{
        background-color: white;
        z-index: -1;
    }
    
    form div.form-group span.error{
        font-size: 17pt;
        position: absolute;
        margin-right: 10px;
        top: 5px;
        right: 0;
        color: #f16a18;
    }

    form div.form-group span.success{
        font-size: 17pt;
        position: absolute;
        margin-right: 10px;
        top: 5px;
        right: 0;
        color: #6bc352;
    }
  `],
  templateUrl: './recover.component.html',
    providers: [UserService, LoadingService]
})
export class RecoverComponent {
    user: IUser;
    constructor(
        private userService: UserService,
        private loadingService: LoadingService,
        private notify: NotifyService,
        private router: Router
    ) {
        this.user = new UserModel();
    }

    recover( ) {
        this.loadingService.show('Recuperando...');
        this.userService.recover(this.user)
            .subscribe( (response: IResponse) =>{
                this.loadingService.hide();
                if( response.result == true){
                    this.router.navigate(['/site/home/success/' + response.message]);
                }else{
                    this.notify.error(response.message, "Aviso");
                }
            });
    }
}