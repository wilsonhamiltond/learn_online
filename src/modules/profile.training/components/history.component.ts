import { Component, OnInit } from '@angular/core';

import { UtilsService } from '../../../services/utils/utils.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { IEnrollment } from '../../../models/training/enrollment.model';
import { EnrollmentService, ENROLLMENT_STATUS_ENUM } from '../../../services/training/enrollment.service';
import { IResponse } from '../../../models/utils/response.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';

@Component({
    templateUrl: './history.component.html',
    providers: [UtilsService, EnrollmentService, LoadingService]
})
export class TrainingHistoryComponent implements OnInit{  
    enrollments: Array<IEnrollment> = [];
    displayedColumns = ['training', 'section', 'start_date', 'end_date', 'percentage','status', 'action'];

    ENROLLMENT_STATUS_ENUM = ENROLLMENT_STATUS_ENUM;

    constructor(
      public notify: NotifyService,
      public utilsService: UtilsService,
      private enrollmentService: EnrollmentService,
      private dialog: MatDialog
    ) { 
    }
  
    ngOnInit() {
      this.utilsService.setLinks([
          {
              title: 'HISTORICO DE CURSOS',
              active: true
          }
      ]);
      this.utilsService.show();
      this.enrollmentService.history().subscribe((response:IResponse) =>{
        if(response.result){
          this.enrollments = response.docs;
        }
        this.utilsService.hide();
      })
    }

    download(enrollment:IEnrollment){
      this.utilsService.show();
      this.enrollmentService.download(enrollment).subscribe((response:IResponse) =>{
        if(response.result){
          let anchor:any = document.createElement('a');
          anchor.href = `data:${response.doc.type};base64,${response.doc.url}`;
          anchor.target = '_blank';
          anchor.download = `${enrollment._id}.png`;
          anchor.click();
        }

        this.utilsService.hide();
      })
    }
    
    suspend(enrollment:IEnrollment){
        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.load({
          message: '¿Desea retirar tu inscripción en este curso?',
          title: 'CONFIRMACIÓN',
          cancel: 'No',
          accent: 'Si'
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.utilsService.show('Borrando curso...')
            this.enrollmentService.get(enrollment._id, false)
            .subscribe((response:IResponse) => {
              if (response.result == true) {
                response.doc.status = ENROLLMENT_STATUS_ENUM.retired;
                response.doc.end_date = new Date();
                this.enrollmentService.update(enrollment._id, response.doc).subscribe(() =>{
                  this.notify.success('Se ha retirado correctamente del curso.');
                  this.ngOnInit()
                })
              } else {
                this.notify.error('Error retirando el curso.');
                console.log(response.message)
              }
              this.utilsService.hide();
            })
          }
        })
    }
  }