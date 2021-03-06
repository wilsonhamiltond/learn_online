﻿import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { ForumService } from '../../../services/training/forum.service';
import { IForum } from '../../../models/training/forum.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';
import { IResponse } from '../../../models/utils/response.model';
import { IStage } from '../../../models/training/stage.model';
import { StageService } from '../../../services/training/stage.service';
import { TrainingService } from '../../../services/training/training.service';

@Component({
  templateUrl: './list.component.html',
  providers: [UtilsService, ForumService, LoadingService, StageService, TrainingService]
})
export class ForumListComponent implements OnInit {
  module: any;
  forums: Array<IForum> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      'name': true,
      'order': true,
      stage: {
        name: 1,
        _id: 1
      }
    }
  };
  stage: IStage;
  displayedColumns = ['name', 'order', 'stage', 'action'];

  constructor(
    public forumService: ForumService,
    public activateRouter: ActivatedRoute,
    public notify: NotifyService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public loading: LoadingService,
    private stageService: StageService,
    private trainingService: TrainingService
  ) {
  }

  ngOnInit() {
    let links = [{
      title: 'Administración',
      link: '/admin/home'
    }, {
      title: 'Modulo',
      link: '/admin/stage/list'
    }, {
      title: 'Listado de foros',
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
    this.loading.show('Cargando foros...');
    if (this.query) {
      let or: any = [{
        'name': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;

    paginateFilter(this.params, this.forumService).subscribe((response: any) => {
      this.forums = response.data;
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

  delete(user: IForum) {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea borrar este foro?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading.show('Borrando foro...')
        this.forumService.delete(user._id).subscribe((response) => {
          if (response['result'] == true) {
            this.notify.success('Foro borrado correctamente.');
            this.paginate()
          } else {
            this.notify.error('Error borrando el foro.');
            console.log(response.message)
          }
          this.loading.hide();
        })
      }
    })
  }
}