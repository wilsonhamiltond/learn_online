import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { PracticeListComponent } from './components/list.component';
import { PracticeCreateComponent } from './components/create.component';

/* Routes */
import { AdminPracticeRouting } from './admin.practice.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminPracticeRouting,
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
      CKEditorModule
    ],
    declarations: [
      PracticeListComponent,
      PracticeCreateComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminPracticeModule { }