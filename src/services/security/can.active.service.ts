import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GetUserModules } from './user.service';

import { SetUserModules, requestOptions } from '../utils/utils.service';
import { IModule } from '../../models/security/module.model';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

declare let window:any;

@Injectable()
export class CanActivateService implements CanActivate {
  constructor( 
    public router: Router,
    public http: Http
  ) {
  }

  canActivate( prev:any, next:any) {
    //return true;
    let modules:Array<IModule> = GetUserModules();

    let url = decodeURIComponent(next.url);
    
    let params = this.getParams( next._root.children[0] )
       
    for(let prop in params ){
      let param = params[prop];
      url = url.replace(param, ':' + prop);
    }
    let result = modules.some( (module:IModule)=> {
        if( module.url == url){
          SetUserModules(module)
          return true;
        }
      return false;
    });
    if( result == true){
        this.http.get(`api/v1/session/keepalive`, requestOptions )
        .pipe( map((res:any)=> res.json())).subscribe(
            (resopnse:any)=>{}, 
            (error:any)=>{
              sessionStorage.removeItem('educate_user');
              this.http.post('api/v1/user/logout', requestOptions).subscribe( ()=>{})
              this.router.navigate(['/login'])
            })
    }
    return result;
  }
  getParams(route:any){
    let params = Object.assign({}, route.value.params || {});
    
    if(route.children.length > 0){
      params = Object.assign( params, this.getParams(route.children[0]))
    }

    return params;
  }
}