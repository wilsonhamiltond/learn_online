import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UserService, SetUser } from '../../../services/security/user.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { IResponse } from '../../../models/utils/response.model';

@Component({
    styles: [`
    .body{
        padding: 10px 16px;
    }
    .btn-facebook{
        background-color: #286090 !important;
        border-color: #204d74 !important;
        color: #FFF !important;
    }
    .btn-facebook:hover{
        color: #286090;
    }
    .btn-facebook:hover:before{
        background-color: white;
        z-index: -1;
    }
    .circle-container{
        width: 100px;
        height: 100px;
        left: 50%;
        position: relative;
        margin-left: -50px;
    }
    .circle-container span.number{
        font-size: 30pt;
        color: #1abc9c;
        position: relative;
        top: -80px;
        left: 0px;
    }
    `],
    selector: 'verify',
    templateUrl: './verify.component.html',
    providers: [LoadingService, UserService]
})
export class VerifyComponent{
    tokenResult: IResponse;
    loading: boolean = true;
    time:number = 20;
    currentTime:number = 0;

    constructor(
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private userService: UserService,
        private router: Router
    ){
        this.activatedRoute.params.subscribe( (params:any) =>{
            this.loadingService.show('Verificando usuario...');
            var token = params['token'];
            this.userService.verify(token).subscribe( (response: IResponse) => {
                this.tokenResult = response;
                this.loadingService.hide();
                this.loading = false;
                if( this.tokenResult.result == true){
                    SetUser(response.doc);
                    var interval = setInterval(()=>{
                        if( this.currentTime >= this.time){
                            clearInterval(interval);
                            this.router.navigate(['/profile/home']);
                        }else{
                            this.currentTime++;
                        }
                    }, 1000);
                }
            });
        });
    }
    
}