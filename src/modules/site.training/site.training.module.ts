import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';

/* Routes */
import { SiteTrainingRouting } from './site.training.routes';

/* Component */
import { TrainingDetailsComponent } from './components/details.component';
import { TrainingSearchComponent } from './components/search.component';

import { NotifyService } from '../../services/utils/notify.service';
import { MatIconModule, MatInputModule, MatDialogModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      SiteTrainingRouting,
      MatIconModule,
      MatInputModule,
      MatDialogModule
    ],
    declarations: [
      TrainingDetailsComponent,
      TrainingSearchComponent
    ],
    providers: [
      NotifyService,
      UtilsService
    ],
    bootstrap:    [   ]
})
export class SiteTrainingModule { }