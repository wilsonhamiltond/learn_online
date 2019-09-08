import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, GetUser } from '../../../services/security/user.service';
import { UserModel, IUser } from '../../../models/security/user.model';

import { LoadingService } from '../../../services/utils/loading.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { IResponse } from '../../../models/utils/response.model';

@Component({
    selector: 'password-change',
    styles: [`
    form div.form-group input{
        padding-left: 40px;
        border-radius: 0;
        height: 48px;
        border: 0;
        font-size: 14pt;
        box-shadow: 0px 0px 2px 1px #808080;
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

    form div.form-group input:hover{
        box-shadow: 0px 0px 2px 1px #1abc9c;
    }
    form div.form-group > i.material-icons{    
        margin-left: 0px;
        font-size: 17pt;
        position: absolute;
        margin-left: 10px;
        margin-top: 13px;
        color: gray;
    }
    .dialog .body{
        padding: 10px 16px;
    }
    .body button{
        border-radius: 2px;
    }
    .body button i{
        font-size: 13pt;
    }
    mat-checkbox .material-icons{
        background: green;
    }
  `],
    templateUrl: './password.component.html',
    providers: [UserService, LoadingService, UtilsService]
})
export class PasswordComponent implements OnInit {

    user: IUser;
    token: string;    
    constructor(
        private userService: UserService,
        private loadingService: LoadingService,
        private router: Router,
        private notify: NotifyService,
        private utilsService: UtilsService
    ) { }

    ngOnInit() {
        this.utilsService.setLinks([
            {
                title: 'CAMBIO DE CONTRASEÑA',
                active: true
            }
        ]);
        this.user = GetUser();
    }

    save(): void {
        this.loadingService.show('Modificando su contraseña...');
        this.userService.password_change(this.user._id, this.user).subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.router.navigate(['/profile/home' + response.message]);
                this.notify.success(response.message, 'Aviso');
            } else {
                this.notify.error(response.message, 'Aviso');
                this.user.last_password = '';
                this.user.password = '';
                this.user.password_confirm = '';
            }
        });
    }
}