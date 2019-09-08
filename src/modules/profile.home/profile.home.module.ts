import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { HomeComponent } from './components/home.component';

/* Routes */
import { ProfileHomeRouting } from './profile.home.routes';

@NgModule({
  imports: [
      CommonModule,
      HttpModule,
      UtilsModule,
      ProfileHomeRouting
    ],
    declarations: [
      HomeComponent
    ],
    providers: [NotifyService],
    bootstrap:    [ ]
})
export class ProfileHomeModule { }