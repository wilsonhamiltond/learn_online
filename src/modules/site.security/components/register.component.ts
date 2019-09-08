import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, USER_STATUS_ENUM } from '../../../services/security/user.service';
import { UserModel, IUser } from '../../../models/security/user.model';
import { LoadingService } from '../../../services/utils/loading.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';

@Component({
  selector: 'register',
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
    mat-checkbox .material-icons {
        background: green;
    }
  `],
  templateUrl: './register.component.html',
    providers: [UserService, LoadingService, NotifyService]
})
export class RegisterComponent implements OnInit {
    user: IUser;
    invalid_name: boolean = false;
    constructor(
        private userService: UserService,
        private loadingService: LoadingService,
        private router: Router,
        private notify: NotifyService
    ) {}

    ngOnInit(){
        this.user = new UserModel();
    }
    verify(){
        this.loadingService.show( 'Espere un momento, estamos validando su nombre de usuario.' );
        this.userService.check(this.user.user_name).subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            this.invalid_name = response.result;
            if(this.invalid_name == true){
                this.notify.warning(response.message)
            }
        });
    }
    save( ):void {
        this.loadingService.show( 'Espere un momento, estamos registrando su cuenta.' );
        let user:any = Object.assign({}, this.user);
        user.person.email = user.user_name;
        user.status = USER_STATUS_ENUM.inactived;
        this.userService.register( user ).subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.router.navigate(['/site/home/success/' + response.message]);
            }else{
                this.router.navigate(['/site/home/error/' + response.message]);
            }
        });
    }
}