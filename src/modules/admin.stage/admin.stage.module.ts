import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { StageListComponent } from './components/list.component';
import { StageCreateComponent } from './components/create.component';

/* Routes */
import { AdminStageRouting } from './admin.stage.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminStageRouting,
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
      MatNativeDateModule
    ],
    declarations: [
      StageListComponent,
      StageCreateComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminStageModule { }