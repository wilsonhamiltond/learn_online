import { Component, OnInit } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { UserService } from '../../../services/security/user.service';

import { IUser } from '../../../models/security/user.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './list.component.html',
    providers: [UtilsService, UserService]
})
export class UserListComponent implements OnInit{  
    module: any;
  
    users: Array<IUser> = [];
    public query: string = '';
    public size: number = 0;
    public params: any = {
      params: {},
      limit: 10,
      sort: { name: -1 },
      skip: 0,
      fields: {
        'user_name': true,
        type: 1,
        person: {
          name: true,
          last_name: true,
        },
        status: {
          name: true
        }
      }
    };
    displayedColumns = ['user_name', 'name', 'status', 'type', 'action'];
  
    constructor(
      public userService: UserService,
      public notify: NotifyService,
      public dialog: MatDialog,
      public utilsService: UtilsService
    ) {
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Usuarios',
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
          'user_name': `/${this.query}/`
        }]
        this.params.params = {
          $and: [{ $or: or }]
        }
      } else
        this.params.params = {};
  
      paginateFilter(this.params, this.userService).subscribe((response: any) => {
        this.users = response.data;
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
  
    delete(user: IUser) {
      let dialogRef = this.dialog.open(ConfirmDialog);
      dialogRef.componentInstance.load({
        message: '¿Desea borrar este usuario?',
        title: 'CONFIRMACIÓN',
        cancel: 'No',
        accent: 'Si'
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.utilsService.show()
          this.userService.delete(user._id).subscribe((response) => {
            if (response['result'] == true) {
              this.notify.success('Usuario borrado correctamente.');
              this.paginate()
            } else {
              this.notify.error('Error borrando el usuario.');
              console.log(response.message)
            }
            this.utilsService.hide();
          })
        }
      })
    }
  }