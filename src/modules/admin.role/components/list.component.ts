import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { RoleService } from '../../../services/security/role.service';

import { IRole } from '../../../models/security/role.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './list.component.html',
    providers: [UtilsService, RoleService, LoadingService]
})
export class RoleListComponent implements OnInit{  
    module: any;
  
    roles: Array<IRole> = [];
    public query: string = '';
    public size: number = 0;
    public params: any = {
      params: {},
      limit: 10,
      sort: { name: -1 },
      skip: 0,
      fields: {
        'name': true,
        'description': true,
        'actived': true
      }
    };
    displayedColumns = ['name', 'description', 'status', 'modules', 'action'];
  
    constructor(
      public roleService: RoleService,
      public notify: NotifyService,
      public dialog: MatDialog,
      public utilsService: UtilsService
    ) {
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Perfiles',
                active: true
            }
        ]);
    }
  
    ngOnInit() {
      this.paginate();
    }
  
    paginate() {
      this.utilsService.show();
      if (this.query) {
        let or: any = [{
          'name': `/${this.query}/`
        }, {
          'description': `/${this.query}/`,
        }]
        this.params.params = {
          $and: [{ $or: or }]
        }
      } else
        this.params.params = {};
  
      paginateFilter(this.params, this.roleService).subscribe((response: any) => {
        this.roles = response.data;
        this.size = response.size;
        this.utilsService.hide();
      });
    }
  
    search(event?: any) {
      if (event && event.keyCode == 13) {
        this.params.skip = 0;
        this.query = event.target.value;
        this.paginate()
      } else if (!event) {
        this.paginate()
      }
    }
  
    onPage(event: any) {
      this.params.limit = event.pageSize;
      this.params.skip = (event.pageIndex * event.pageSize);
      this.paginate();
    }
  
    delete(user: IRole) {
      let dialogRef = this.dialog.open(ConfirmDialog);
      dialogRef.componentInstance.load({
        message: '¿Desea borrar este perfil?',
        title: 'CONFIRMACIÓN',
        cancel: 'No',
        accent: 'Si'
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.utilsService.show()
          this.roleService.delete(user._id).subscribe((response) => {
            if (response['result'] == true) {
              this.notify.success('Perfil borrado correctamente.');
              this.paginate()
            } else {
              this.notify.error('Error borrando el perfil.');
              console.log(response.message)
            }
            this.utilsService.hide();
          })
        }
      })
    }
  }