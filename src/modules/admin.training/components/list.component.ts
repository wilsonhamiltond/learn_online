import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { TrainingService } from '../../../services/training/training.service';
import { ITraining } from '../../../models/training/training.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { LoadingComponent } from '../../utils/components/loading.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './list.component.html',
    providers: [UtilsService, TrainingService, LoadingService]
})
export class TrainingListComponent implements OnInit{  
    module: any;
    trainings: Array<ITraining> = [];
    public query: string = '';
    public size: number = 0;
    public params: any = {
      params: {},
      limit: 10,
      sort: { title: -1 },
      skip: 0,
      fields: {
        'title': true,
        category: {
          name: 1
        },
        language: {
          name: 1
        },
        status: {
          name: 1
        }
      }
    };
    displayedColumns = ['title', 'category', 'language', 'status', 'sections', 'action'];
  
    constructor(
      public trainingService: TrainingService,
      public notify: NotifyService,
      public dialog: MatDialog,
      public utilsService: UtilsService,
      public loading: LoadingService 
    ) {
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Cursos',
                active: true
            }
        ]);
    }
  
    ngOnInit() {
      this.paginate();
    }
  
    paginate() {
      this.loading.show('Cargando cursos...');
      if (this.query) {
        let or: any = [{
          'title': `/${this.query}/`
        }, {
          'description': `/${this.query}/`,
        }]
        this.params.params = {
          $and: [{ $or: or }]
        }
      } else
        this.params.params = {};
  
      paginateFilter(this.params, this.trainingService).subscribe((response: any) => {
        this.trainings = response.data;
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
  
    delete(user: ITraining) {
      let dialogRef = this.dialog.open(ConfirmDialog);
      dialogRef.componentInstance.load({
        message: '¿Desea borrar este curso?',
        title: 'CONFIRMACIÓN',
        cancel: 'No',
        accent: 'Si'
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.loading.show('Borrando curso...')
          this.trainingService.delete(user._id).subscribe((response) => {
            if (response['result'] == true) {
              this.notify.success('Curso borrado correctamente.');
              this.paginate()
            } else {
              this.notify.error('Error borrando el curso.');
              console.log(response.message)
            }
            this.loading.hide();
          })
        }
      })
    }
  }