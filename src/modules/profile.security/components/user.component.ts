import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { UserService, GetUser, USER_STATUS_ENUM, USER_TYPE_ENUM } from '../../../services/security/user.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { UserModel, IUser } from '../../../models/security/user.model';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService, CKEDITOR_CONFIG } from '../../../services/utils/utils.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { OnProgress } from '../../../services/base.service';
import { IResponse } from '../../../models/utils/response.model';
import { forkJoin } from 'rxjs';
import { PersonService } from '../../../services/security/person.service';

@Component({
  selector: 'profile-edit',
  styles: [`form div.field input{
        padding-left: 40px;
        border-radius: 0;
        height: 48px;
        border: 0;
        background: white !important;
        font-size: 14pt;
        box-shadow: 0px 0px 2px 1px #808080;
    }
    form div.field span.error{
        font-size: 17pt;
        position: absolute;
        margin-right: 10px;
        top: 5px;
        right: 0;
        color: #f16a18;
    }

    form div.field span.success{
        font-size: 17pt;
        position: absolute;
        margin-right: 10px;
        top: 5px;
        right: 0;
        color: #6bc352;
    }

    form div.field input:hover{
        box-shadow: 0px 0px 2px 1px #1abc9c;
    }
    form div.field > i{    
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
    div img.avatar{
        box-shadow: 0px 0px 10px 5px #b9b9b9;
        width: 100%;
        max-height: 165px;
    }
    .circle-container{
        position: relative;
        left: 50%;
        margin-left: -50px;
    }
    
    .circle-container span.number{
        font-size: 15pt;
        color: #1abc9c;
        position: relative;
        top: -65px;
        left: 25px;
    }
    .avatar-change{
        bottom: 0;
    }
  `],
  templateUrl: './user.component.html',
        providers: [UserService, LoadingService, CatalogService, UtilsService, PersonService]
})
export class UserComponent implements OnInit {

    @ViewChild('profileImage')
    profileImage: ElementRef;

    user: IUser;

    genders: Array<ICatalog>;
    documentTypes: Array<ICatalog>;
    loading:boolean = false;
    progress:number = 0;
    LOCAL_USER_KEY = USER_TYPE_ENUM.local;
    config:any = CKEDITOR_CONFIG;
    constructor(
        private userService: UserService,
        private catalogService: CatalogService,
        private loadingService: LoadingService,
        private router: Router,
        private notify: NotifyService,
        private zone: NgZone,
        private utilsService: UtilsService,
        private personService: PersonService
    ) {
        this.genders = [];
        this.documentTypes = [];
    }

    ngOnInit(){
        this.utilsService.setLinks([
            {
                title: 'MODIFICAR MIS DATOS',
                active: true
            }
        ]);
        OnProgress.subscribe( (progress: number)=>{
            this.progress = progress;
            this.zone.run(()=>{});
        });
        this.load();
    }

    changeFile(e:any){
        if(e.target.files.length != 0){
            var file = e.target.files[0];
            this.loading = true;
            this.userService.upload(file).subscribe( (response: IResponse) =>{
                if( response.result){
                    this.user.person.avatar_url = `files/temps/${response.file.filename}`
                    this.user.person['temp_url'] = response.file.filename;
                    this.loading = false;
                    this.zone.run(()=>{});
                }else{
                    alert(response.message);
                    this.loading = false;
                    this.zone.run(()=>{});
                }
            });
        }
    }

    load( ) {
        this.loadingService.show('Cargando...');

        let requests = [ 
            this.userService.get( GetUser()._id, true),
            this.catalogService.document_types(),
            this.catalogService.genders()];
        forkJoin( requests)
            .subscribe( (responses: Array<IResponse> ) =>
            {
                this.loadingService.hide();
                if( responses[0].result == true){
                    this.user = <IUser>responses[0].doc;
                }
                if( responses[1].result == true){
                    this.documentTypes = <Array<ICatalog>>responses[1].docs;
                }
                if( responses[2].result == true){
                    this.genders = <Array<ICatalog>>responses[2].docs;
                }
            });
    }

    save( ):void {
        this.loadingService.show( 'Modificando sus datos' );
        let person = Object.assign({}, this.user.person);
        if(this.user.type == USER_TYPE_ENUM.local)
            person.avatar_url = person['temp_url'];
        this.personService.update( person._id, person ).subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.router.navigate(['/profile/home']);
                this.notify.success( response.message, 'Aviso');
            }else{
                this.notify.error( response.message, 'Aviso');
            }
        });
    }
}