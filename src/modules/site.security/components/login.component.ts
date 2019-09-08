import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, SetUser, GetUser, GoogleErrorReason, USER_STATUS_ENUM, USER_TYPE_ENUM } from '../../../services/security/user.service';

import { EnrollmentModel, IEnrollment } from '../../../models/training/enrollment.model';
import { TrainingService } from '../../../services/training/training.service';
import { UserModel, IUser } from '../../../models/security/user.model';
import { LoadingService } from '../../../services/utils/loading.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { NotifyService } from '../../../services/utils/notify.service';
import { IResponse } from '../../../models/utils/response.model';
import { PersonModel } from '../../../models/security/person.model';
import { EnrollmentService, ENROLLMENT_STATUS_ENUM } from '../../../services/training/enrollment.service';

declare var document: any, gapi: any, FB: any, window: any;
@Component({
    selector: 'login',
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
    .login .body{
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
    templateUrl: './login.component.html',
    providers: [UserService, LoadingService, TrainingService, EnrollmentService]
})
export class LoginComponent implements OnInit {
    user: IUser;
    training_id: string = '';

    auth2: any;

    client_id: string = '223442761068-qkk8iqdnhobemq5l8p5mkubpfrpfms91.apps.googleusercontent.com';
    fbConfig = {
        appId: '321912544641821',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
    };

    constructor(
        private userService: UserService,
        private loadingService: LoadingService,
        private notify: NotifyService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private enrollmentService: EnrollmentService,
        private trainingService: TrainingService
    ) {
        this.user = new UserModel();
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            this.training_id = params['training_id'];
        });
        this.gInit(document, 'script', 'google-sdk')
        this.fbInit(document, 'script', 'facebook-jssdk')
    }

    enrollment(user: IUser) {
        this.trainingService.subscribed(this.training_id).subscribe((response: any) => {
            if (!response.subscribed) {
                let enrollment: any = new EnrollmentModel();
                enrollment.person = user.person._id;
                enrollment.status = ENROLLMENT_STATUS_ENUM.subscribed;
                enrollment.section = this.training_id;
                this.loadingService.show('Inscribiéndome...');
                this.enrollmentService.save(enrollment).subscribe((response: IResponse) => {
                    this.loadingService.hide();
                    if (response.result == true) {
                        this.notify.success(response.message, "Inscripción");
                        this.router.navigate([`/institute/${this.training_id}/home`]);
                    } else {
                        this.notify.warning(response.message, "Inscripción");
                        this.router.navigate(['/profile/home']);
                    }
                });
            }else{
                this.router.navigate([`/institute/${this.training_id}/home`]);
            }
        })
    }

    gInit(d: Document, s: string, id: string): void {
        var js: any, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://apis.google.com/js/platform.js";
        js.setAttribute('async', 'true');
        js.setAttribute('defer', 'true');
        fjs.parentNode.insertBefore(js, fjs);
    }

    fbInit(d: Document, s: string, id: string): void {
        window.fbAsyncInit = () => {
            FB.init(this.fbConfig);
            FB.AppEvents.logPageView();
        };
        var js: any, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }

    gLogin(): void {
        this.loadingService.show('Espere un momento, verificando su cuenta.');
        gapi.load('auth2', () => {
            this.auth2 = gapi.auth2.init({
                client_id: this.client_id
            })
            this.auth2.then((a: any) => {
                var r2 = a.grantOfflineAccess().then((authResult: any) => {
                    if (authResult['code']) {
                        var r = a.currentUser.listen((userResponse: any) => {
                            var profile = userResponse.getBasicProfile();
                            var user: any = new UserModel();
                            user.type = USER_TYPE_ENUM.google;
                            user.user_name = profile.getEmail();
                            user.password = profile.getId();
                            user.status = USER_STATUS_ENUM.actived;
                            user.person = new PersonModel();
                            user.person.email = profile.getEmail();
                            user.person.avatar_url = profile.getImageUrl();
                            user.person.name = profile.getName();
                            user.person.last_name = profile.getFamilyName();
                            this.userService.register(user).subscribe((response: IResponse) => {
                                this.loadingService.hide();
                                if (response.result == true) {
                                    this.setLogin(response);
                                    if (!response['user'].login)
                                        this.notify.success('Bienvenido a educate en linea, se ha enviado un correo de bienvenida.', 'User')
                                }
                                else {
                                    this.loadingService.hide();
                                    console.log(response.message)
                                    this.notify.error('Ha ocurrido un error tratando de registrar tu usuario.', 'User')
                                }
                            })
                        });
                    } else {
                        this.notify.error('Error authenticating user.', 'Error')
                        this.loadingService.hide();
                    }
                });

                r2.then(() => { }, (reason: any) => {
                    this.loadingService.hide();
                    if (reason)
                        this.notify.error(GoogleErrorReason[reason.error], 'GOOGLE API')
                })
            }).then(() => { }, (reason: any) => {
                this.loadingService.hide();
                if (reason)
                    this.notify.error(GoogleErrorReason[reason.error], 'GOOGLE API')
            });
        });
    }

    fbLogin(): void {
        this.loadingService.show('Espere un momento, verificando su cuenta.');
        FB.getLoginStatus((response: any) => {
            if (response.status === 'connected') {
                FB.api('/me',
                    {
                        fields: "id,email,first_name,last_name,middle_name,name"
                    },
                    (apiResponse: any) => {
                        var user: any = new UserModel();
                        user.type = USER_TYPE_ENUM.facebook;
                        user.user_name = apiResponse.email;
                        user.password = response.authResponse.userID;
                        user.status = USER_STATUS_ENUM.actived;
                        user.person = new PersonModel();
                        user.person.email = apiResponse.email;
                        user.person.avatar_url = `http://graph.facebook.com/${response.authResponse.userID}/picture?type=normal`;
                        user.person.name = apiResponse.first_name;
                        user.person.last_name = apiResponse.last_name;
                        this.userService.register(user).subscribe((response: IResponse) => {
                            this.loadingService.hide();
                            if (response.result == true) {
                                this.setLogin(response);
                                if (!response['user'].login)
                                    this.notify.success('Bienvenidos a educate en linea.', 'Usuario')
                            }
                            else {
                                this.loadingService.hide();
                                console.log(response.message)
                                this.notify.error('Error del sistema.', 'Usuario')
                            }
                        })
                    })
            } else {
                FB.login(() => {
                    this.fbLogin();
                }, {
                        scope: 'public_profile,email,user_friends'
                    });
            }
        });
    }

    login() {
        this.loadingService.show('Iniciando sessión...');
        this.userService.login(this.user)
            .subscribe((response: IResponse) => {
                this.loadingService.hide();
                this.setLogin(response);
            });
    }

    setLogin(response: any) {
        if (response.result == true) {
            SetUser(response.user);
            if (this.training_id) {
                this.enrollment(response.user);
            } else {
                this.notify.success('Ha iniciado sesión correctamente.', "Usuario");
                this.router.navigate(['/profile/home']);
            }
        } else {
            this.user.password = '';
            this.notify.error(response.message, "Aviso");
        }
    }
}