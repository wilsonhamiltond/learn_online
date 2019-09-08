import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { TrainingListComponent } from './components/list.component';
import { TrainingCreateComponent } from './components/create.component';

/* Routes */
import { AdminTrainingRouting } from './admin.training.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatAutocompleteModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatChipsModule } from '@angular/material';
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
      AdminTrainingRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatCardModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatOptionModule,
      MatAutocompleteModule,
      MatSelectModule,
      MatCheckboxModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatChipsModule,
      CKEditorModule
    ],
    declarations: [
      TrainingListComponent,
      TrainingCreateComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminTrainingModule { }