import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { SectionListComponent } from './components/list.component';
import { SectionCreateComponent } from './components/create.component';

/* Routes */
import { AdminSectionRouting } from './admin.section.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';
import { EnrollmentsListComponent } from './components/enrrollments.component';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminSectionRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatCardModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatOptionModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatCheckboxModule
    ],
    declarations: [
      SectionListComponent,
      SectionCreateComponent,
      EnrollmentsListComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminSectionModule { }