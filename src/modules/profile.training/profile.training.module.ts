import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';

/* Routes */
import { ProfileTrainingRouting } from './profile.training.routes';

/* Component */


import { NotifyService } from '../../services/utils/notify.service';
import { MatIconModule, MatTableModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { TrainingHistoryComponent } from './components/history.component';

@NgModule({
  imports: [ 
      CommonModule,
      HttpModule,
      UtilsModule,
      ProfileTrainingRouting,
      MatIconModule,
      MatTableModule,
      MatButtonModule,
      MatDialogModule
    ],
    declarations: [
      TrainingHistoryComponent
    ],
    providers: [
      NotifyService,
      UtilsService
    ],
    bootstrap:    [   ]
})
export class ProfileTrainingModule { }