import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { StageService } from '../../../services/training/stage.service';
import { IStage } from '../../../models/training/stage.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
  providers: [UtilsService, StageService, LoadingService]
})
export class StageListComponent implements OnInit {
  module: any;
  stages: Array<IStage> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      'name': true,
      'start_date': true,
      'end_date': true,
      section: {
        code: 1,
        _id: 1
      },
      status: {
        name: 1
      }
    }
  };
  section_id: string;
  displayedColumns = ['name', 'section', 'status', 'practices', 'forums', 'materials', 'tests', 'action'];

  constructor(
    public stageService: StageService,
    public activateRouter: ActivatedRoute,
    public notify: NotifyService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public loading: LoadingService
  ) {
  }

  ngOnInit() {
    let links = [{
      title: 'Administración',
      link: '/admin/home'
    }, {
      title: 'Secciones',
      link: '/admin/section/list'
    }, {
      title: 'Listado de modulo',
      active: true
    }];
    this.utilsService.setLinks(links);
    this.activateRouter.params.subscribe((params: any) => {
      this.section_id = params['section_id'];
      this.params.params['section'] = {
        object_id: true,
        value: params['section_id']
      }
      this.paginate();
    })
  }

  paginate() {
    this.loading.show('Cargando modulos...');
    if (this.query) {
      let or: any = [{
        'name': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;

    paginateFilter(this.params, this.stageService).subscribe((response: any) => {
      this.stages = response.data;
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

  delete(user: IStage) {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea borrar este modulo?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading.show('Borrando modulo...')
        this.stageService.delete(user._id).subscribe((response) => {
          if (response['result'] == true) {
            this.notify.success('Modulo borrado correctamente.');
            this.paginate()
          } else {
            this.notify.error('Error borrando el modulos.');
            console.log(response.message)
          }
          this.loading.hide();
        })
      }
    })
  }
}