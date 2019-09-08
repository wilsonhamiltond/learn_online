import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';
import { EnrollmentService } from 'src/services/training/enrollment.service';
import { IEnrollment } from 'src/models/training/enrollment.model';

@Component({
  templateUrl: './enrrollments.component.html',
  providers: [UtilsService, EnrollmentService]
})
export class EnrollmentsListComponent implements OnInit {
  module: any;
  enrollments: Array<IEnrollment> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      section: {
        'code': true
      },
      person: {
        name: true,
        last_name: true
      },
      'create_date': true,
      status: {
        name: 1
      }
    }
  };
  section_id: string;
  displayedColumns = ['section', 'person', 'create_date', 'status'];

  constructor(
    public enrollmentService: EnrollmentService,
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
      title: 'Listado de Secciones',
      link: '/admin/section/list'
    }, {
      title: 'Estudiantes Inscritos',
      active: true
    }];
    this.activateRouter.params.subscribe((params: any) => {
      this.section_id = params['_id'];
      this.params.params['section'] = this.section_id;
      this.utilsService.setLinks(links);
      this.paginate();
    })
  }

  paginate() {
    this.loading.show('Cargando inscripciones...');
    if (this.query) {
      let or: any = [{
        'person.name': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;
    
    paginateFilter(this.params, this.enrollmentService).subscribe((response: any) => {
      this.enrollments = response.data;
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

}