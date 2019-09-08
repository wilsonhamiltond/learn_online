import { Component, OnInit, ViewChild } from '@angular/core';

import { UtilsService, paginateFilter } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { SectionService } from '../../../services/training/section.service';
import { ISection } from '../../../models/training/section.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { ActivatedRoute } from '@angular/router';
import { GetUser } from '../../../services/security/user.service';

@Component({
  templateUrl: './list.component.html',
  providers: [UtilsService, SectionService, LoadingService]
})
export class SectionListComponent implements OnInit {
  module: any;
  sections: Array<ISection> = [];
  public query: string = '';
  public size: number = 0;
  public params: any = {
    params: {},
    limit: 10,
    sort: { name: -1 },
    skip: 0,
    fields: {
      'code': true,
      'start_date': true,
      'end_date': true,
      tutorial: true,
      training: {
        title: 1,
        _id: 1
      },
      author: {
        name: 1,
        last_name: 1
      },
      status: {
        name: 1
      }
    }
  };
  training_id: string;
  displayedColumns = ['code', 'author', 'tutorial', 'start_date', 'end_date', 'training', 'status', 'enrollements', 'modules', 'action'];

  constructor(
    public sectionService: SectionService,
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
      active: true
    }];
    this.activateRouter.params.subscribe((params: any) => {
      if (params['training_id']) {
        this.training_id = params['training_id'];
        this.params.params['training'] = {
          object_id: true,
          value: params['training_id']
        }
        links.splice(1, 0, {
          title: 'Cursos',
          link: '/admin/training/list'
        })
      }
      this.utilsService.setLinks(links);
      this.paginate();
    })
  }

  paginate() {
    this.loading.show('Cargando secciones...');
    if (this.query) {
      let or: any = [{
        'code': `/${this.query}/`
      }]
      this.params.params['$and'] = [{ $or: or }];
    } else
      delete this.params.params.$and;
    if(!this.training_id){
      let user = GetUser();
      this.params.params['author'] = user.person._id;
    }
    paginateFilter(this.params, this.sectionService).subscribe((response: any) => {
      this.sections = response.data;
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

  delete(user: ISection) {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea borrar este sección?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loading.show('Borrando sección...')
        this.sectionService.delete(user._id).subscribe((response) => {
          if (response['result'] == true) {
            this.notify.success('Sección borrado correctamente.');
            this.paginate()
          } else {
            this.notify.error('Error borrando el sección.');
            console.log(response.message)
          }
          this.loading.hide();
        })
      }
    })
  }
}