import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { QuestionListComponent } from './components/list.component';
import { QuestionCreateComponent } from './components/create.component';

/* Routes */
import { AdminQuestionRouting } from './admin.question.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';
import { MultipleSelectComponent } from './components/multiple.select.component';
import { OneSelectComponent } from './components/one.select.component';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminQuestionRouting,
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
      MatCheckboxModule,
      MatRadioModule,
      CKEditorModule
    ],
    declarations: [
      QuestionListComponent,
      QuestionCreateComponent,
      MultipleSelectComponent,
      OneSelectComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminQuestionModule { }