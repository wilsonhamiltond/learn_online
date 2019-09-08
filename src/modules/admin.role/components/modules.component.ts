import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RoleService } from '../../../services/security/role.service';
import { IRole } from '../../../models/security/role.model';
import { ModuleService } from '../../../services/security/module.service';
import { IModule } from '../../../models/security/module.model';
import { Observable, forkJoin } from 'rxjs'

import { NotifyService } from '../../../services/utils/notify.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { UtilsService } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';

@Component({
    selector: 'role-modules',
    templateUrl: './modules.component.html',
    providers: [RoleService, ModuleService]
})
export class RoleModulesComponent implements OnInit {
  role:IRole;
  modules:Array<IModule> = [];

  constructor(
    public roleService: RoleService,
    public moduleService: ModuleService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public notify: NotifyService,
    public utilsService: UtilsService,
    public loadingService: LoadingService
  ){
    this.utilsService.setLinks([{
            title: 'Administración',
            link: '/admin/home'
        },{
            title: 'Perfiles',
            link: '/admin/role/list'
        },{
            title: 'Modulos de perfiles',
            active: true
        }
    ]);
  }

  ngOnInit() {
    this.loadingService.show('Cargando...');
    this.activatedRoute.params.subscribe( (params:any) =>{
      let requests:Array<Observable<any>> =[
        this.roleService.get(params['_id']),
        this.moduleService.filter({
            fields:{
                "name" : true,
                "url" : true
            }
        })
      ];
      forkJoin(requests).subscribe( (responses:any) =>{
        this.role = responses[0].doc;
        this.modules = responses[1].docs.map( (module:IModule) =>{
            module['added'] = false;
            this.role.modules.forEach( (m:IModule) =>{
                if( m.url == module.url ){
                    module['added'] = true;
                }
            })
            return module;
        })
        this.loadingService.hide();
      })
    }) 
  }

  select_all(module:IModule, i:number){
      this.modules[i] = module;
  }

  save(){
    this.loadingService.show('Guardando modulos')
    this.role.modules = this.modules.filter( (module:IModule) =>{
        return module['added'] == true;
    })
    this.roleService.update(this.role._id, this.role).subscribe( (response:any) =>{
      if( response.result == true){
        this.notify.success( response.message );
        this.router.navigate(['/admin/role/list'])
      }else{
          this.notify.error('Error actualizando perfil');
          console.log(response.message)
      }
      this.loadingService.hide();
    })
  }
}