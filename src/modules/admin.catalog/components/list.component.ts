import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { CatalogService } from '../../../services/security/catalog.service';

import { IResponse } from '../../../models/utils/response.model'
import { ICatalog } from '../../../models/security/catalog.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './list.component.html',
    providers: [UtilsService, CatalogService, LoadingService]
})
export class CatalogListComponent implements OnInit{  
    module: any;
  
    catalogs: Array<ICatalog> = [];
    public query: string = '';
    public size: number = 0;
    public params: any = {
      params: {},
      limit: 10,
      sort: { namordere: -1 },
      skip: 0,
      fields: {
        'name': true,
        'order': true,
        'description': true,
        'group': true,
        'description2': true
      }
    };
    displayedColumns = ['group', 'order', 'name', 'description', 'description2', 'action'];
  
    constructor(
      public catalogService: CatalogService,
      public notify: NotifyService,
      public dialog: MatDialog,
      public utilsService: UtilsService
    ) {
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Catalogos',
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
        }, {
          'group': `/${this.query}/`,
        }]
        this.params.params = {
          $and: [{ $or: or }]
        }
      } else
        this.params.params = {};
  
      paginateFilter(this.params, this.catalogService).subscribe((response: any) => {
        this.catalogs = response.data;
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
  
    delete(user: ICatalog) {
      let dialogRef = this.dialog.open(ConfirmDialog);
      dialogRef.componentInstance.load({
        message: '¿Desea borrar este catalogo?',
        title: 'CONFIRMACIÓN',
        cancel: 'No',
        accent: 'Si'
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.utilsService.show()
          this.catalogService.delete(user._id).subscribe((response) => {
            if (response['result'] == true) {
              this.notify.success('Catalogo borrado correctamente.');
              this.paginate()
            } else {
              this.notify.error('Error borrando el catalogo.');
              console.log(response.message)
            }
            this.utilsService.hide();
          })
        }
      })
    }
  }