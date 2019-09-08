import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { HomeComponent } from './components/home.component';

/* Routes */
import { AdminHomeRouting } from './admin.home.routes';
import { MatCardModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      MatCardModule,
      MatIconModule,
      HttpModule,
      UtilsModule,
      AdminHomeRouting
    ],
    declarations: [
      HomeComponent
    ],
    providers: [NotifyService],
    bootstrap:    [ ]
})
export class AdminHomeModule { }