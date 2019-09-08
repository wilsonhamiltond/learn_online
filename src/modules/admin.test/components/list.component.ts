import { Component, OnInit } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { TestService } from '../../../services/training/test.service';
import { ITest } from '../../../models/training/test.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../../services/training/stage.service';
import { IStage } from '../../../models/training/stage.model';
import { IResponse } from '../../../models/utils/response.model';

@Component({
  templateUrl: './list.component.html',
  providers: [UtilsService, TestService, StageService, LoadingService]
})
export class TestListComponent implements OnInit {
  module: any;
  tests: Array<ITest> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      'name': true,
      'time': true,
      stage: {
        name: 1,
        _id: 1
      },
      status: {
        name: 1
      }
    }
  };
  stage: IStage;
  displayedColumns = ['name', 'time', 'stage', 'status', 'questions', 'action'];

  constructor(
    public testService: TestService,
    public activateRouter: ActivatedRoute,
    public notify: NotifyService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public loading: LoadingService,
    public stageService: StageService
  ) {  }

  ngOnInit() {
    let links = [{
      title: 'Administración',
      link: '/admin/home'
    }, {
      title: 'Modulo',
      link: '/admin/stage/list'
    }, {
      title: 'Listado de examenes',
      active: true
    }];
    this.activateRouter.params.subscribe((params: any) => {
      this.params.params['stage'] = {
        object_id: true,
        value: params['stage_id']
      }
      this.stageService.get( params['stage_id'] ).subscribe( (response:IResponse) =>{
        this.stage = <IStage>response.doc;
        links[1].link = links[1].link.replace('stage', `stage/${this.stage.section}`);
        this.paginate();
        
        this.utilsService.setLinks(links);
      })
    })
  }

  paginate() {
    this.loading.show('Cargando examenes...');
    if (this.query) {
      let or: any = [{
        'name': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;

    paginateFilter(this.params, this.testService).subscribe((response: any) => {
      this.tests = response.data;
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

  delete(user: ITest) {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea borrar este examen?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading.show('Borrando examen...')
        this.testService.delete(user._id).subscribe((response) => {
          if (response['result'] == true) {
            this.notify.success('Examen borrado correctamente.');
            this.paginate()
          } else {
            this.notify.error('Error borrando el examen.');
            console.log(response.message)
          }
          this.loading.hide();
        })
      }
    })
  }
}