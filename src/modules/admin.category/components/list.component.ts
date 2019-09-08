import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { CategoryService } from '../../../services/training/category.service';
import { ICategory } from '../../../models/training/category.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './list.component.html',
    providers: [UtilsService, CategoryService, LoadingService]
})
export class CategoryListComponent implements OnInit{  
    module: any;
    categorys: Array<ICategory> = [];
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
        parent_category: {
          name: 1
        }
      }
    };
    displayedColumns = ['name', 'description', 'parent', 'action'];
  
    constructor(
      public categoryService: CategoryService,
      public notify: NotifyService,
      public dialog: MatDialog,
      public utilsService: UtilsService,
      public loading: LoadingService 
    ) {
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Categorias',
                active: true
            }
        ]);
    }
  
    ngOnInit() {
      this.paginate();
    }
  
    paginate() {
      this.loading.show('Cargando categorias...');
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
  
      paginateFilter(this.params, this.categoryService).subscribe((response: any) => {
        this.categorys = response.data;
        this.size = response.size;
        this.loading.hide();
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
  
    delete(user: ICategory) {
      let dialogRef = this.dialog.open(ConfirmDialog);
      dialogRef.componentInstance.load({
        message: '¿Desea borrar este categoria?',
        title: 'CONFIRMACIÓN',
        cancel: 'No',
        accent: 'Si'
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.loading.show('Borrando categoria...')
          this.categoryService.delete(user._id).subscribe((response) => {
            if (response['result'] == true) {
              this.notify.success('Categoria borrado correctamente.');
              this.paginate()
            } else {
              this.notify.error('Error borrando el categoria.');
              console.log(response.message)
            }
            this.loading.hide();
          })
        }
      })
    }
  }