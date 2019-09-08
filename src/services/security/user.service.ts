import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';
import { IUser, UserModel } from '../../models/security/user.model';
import { IModule } from '../../models/security/module.model';
import { IRole } from '../../models/security/role.model';
import { loginTrigger } from '../utils/utils.service';

export function SetUser(user:IUser ){
    user.modules = [];
    user.roles.forEach( (role:IRole) =>{
        role.modules.forEach( (mod:IModule)=>{
            if(!user.modules.some( (m:IModule) =>{ return m.url == mod.url }))
                user.modules.push(mod);
        })
    })
    sessionStorage.setItem('educate_user', JSON.stringify( user ));
    loginTrigger.next(GetUser());
}

export const GoogleErrorReason = {
    popup_blocked_by_browser: 'La confgiguración de su navegador esta bloqueando la ventana emergente de google api.',
    popup_closed_by_user: 'La ventana emergente de google api fue cerrado por el usuario o su dispositivo la estóก bloqueando.',
    idpiframe_initialization_failed: 'Error en el api de google, este origen no esta registrado en las credenciales.'
}

export function GetUser(): IUser{
    let user:IUser;
    let userObj = sessionStorage.getItem('educate_user')
    if( userObj){
        user = <IUser>JSON.parse(userObj);
    }

    return user;
}

export function GetUserModules(): Array<IModule>{
    let modules:Array<IModule> = [];
    let userObj = sessionStorage.getItem('educate_user')
    if( userObj){
        let user = <IUser>JSON.parse(userObj);
        user.roles.forEach( (role:IRole) =>{
            role.modules.forEach( (module:IModule) =>{
                if(modules.some( (m:IModule) =>{
                    return m.url == module.url
                }) == false)
                    modules.push(module)
            })
        })
    }

    return modules;
}

export enum USER_STATUS_ENUM{
    actived = '5b883644443e120a1c8e987d',
    inactived = '5b883644443e120a1c8e987f',
    suspended = '5b883644443e120a1c8e987e'
}   
export enum USER_TYPE_ENUM{
    local = 'LOCAL',
    google = 'GOOGLE',
    facebook = 'FACEBOOK'
}  

@Injectable()
export class UserService extends BaseService{
    public user:IUser;

    constructor(
        public http: Http
    ) { 
        super(http, 'user')

        let userObj = sessionStorage.getItem('educate_user')
        if( userObj){
            this.user = <IUser>JSON.parse(userObj);
        }
    }

    public getUser():IUser{
        let userObj = sessionStorage.getItem('educate_user')
        if( userObj){
            this.user = <IUser>JSON.parse(userObj);
        }else{
            this.user = undefined;
        }

        return this.user;
    }

    public setUser(user:IUser){
        sessionStorage.setItem('educate_user', JSON.stringify(user));
        this.user = user;
    }
    public logout(){
        sessionStorage.removeItem('educate_user');
        return this.request('post', 'api/v1/user/logout', {});
    }

    login(user:IUser){
        return this.request('post', `api/v1/user/login`, user);
    }
    passwordChange(user:IUser){
        return this.request('post', `api/v1/user/password`, user);
    }
    setting(email:string){
        return this.request('get', `api/v1/user/${email}/setting`);
    }

    register( user: IUser){
        return this.request( 'post', `${this.base_url}/register`, user);
    }
    check(user_name: string){
        return this.request('get', `api/v1/user/${user_name}/check`);
    }
    verify( token: string){
        return this.request('get', `${this.base_url}/${token}/verify`);
    }

    recover( user: IUser){
        return this.request( 'post', `${this.base_url}/recover`, user)
    }
    password_change(user_id:string, user:IUser ){
        return this.request( 'put', `${this.base_url}/${user_id}/password`, user)
    }
    enrollments(){
        return this.request( 'get', `${this.base_url}/enrollments`)
    }
}