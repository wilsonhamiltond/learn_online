import { Component, OnInit } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { QuestionService } from '../../../services/training/question.service';
import { IQuestion } from '../../../models/training/question.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';
import { TestService } from '../../../services/training/test.service';
import { ITest } from '../../../models/training/test.model';
import { IResponse } from '../../../models/utils/response.model';

@Component({
  templateUrl: './list.component.html',
  providers: [UtilsService, QuestionService, TestService, LoadingService]
})
export class QuestionListComponent implements OnInit {
  module: any;
  questions: Array<IQuestion> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      'description': true,
      'value': true,
      type: {
        name: 1,
        _id: 1
      },
      test: {
        name: 1
      }
    }
  };
  test: ITest;
  displayedColumns = ['description', 'type', 'value', 'test', 'action'];

  constructor(
    public questionService: QuestionService,
    public activateRouter: ActivatedRoute,
    public notify: NotifyService,
    public dialog: MatDialog,
    public utilsService: UtilsService,
    public loading: LoadingService,
    public testService: TestService
  ) {  }

  ngOnInit() {
    let links = [{
      title: 'Administración',
      link: '/admin/home'
    }, {
      title: 'Exsamenes',
      link: '/admin/test/list'
    }, {
      title: 'Listado de pregunta',
      active: true
    }];
    this.activateRouter.params.subscribe((params: any) => {
      this.params.params['test'] = {
        object_id: true,
        value: params['test_id']
      }
      this.testService.get( params['test_id'] ).subscribe( (response:IResponse) =>{
        this.test = <ITest>response.doc;
        links[1].link = links[1].link.replace('test', `test/${this.test.stage}`);
        this.paginate();
        
        this.utilsService.setLinks(links);
      })
    })
  }

  paginate() {
    this.loading.show('Cargando preguntas...');
    if (this.query) {
      let or: any = [{
        'description': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;

    paginateFilter(this.params, this.questionService).subscribe((response: any) => {
      this.questions = response.data;
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

  delete(user: IQuestion) {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea borrar este pregunta?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading.show('Borrando pregunta...')
        this.questionService.delete(user._id).subscribe((response) => {
          if (response['result'] == true) {
            this.notify.success('Pregunta borrado correctamente.');
            this.paginate()
          } else {
            this.notify.error('Error borrando el pregunta.');
            console.log(response.message)
          }
          this.loading.hide();
        })
      }
    })
  }
}