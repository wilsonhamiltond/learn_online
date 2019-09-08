import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';

/* Routes */
import { SiteHomeRouting } from './site.home.routes';

/* Component */
import { HomeComponent } from './components/home.component';
import { SuccessComponent } from './components/success.component';
import { ErrorComponent } from './components/error.component';

import { PolicyComponent } from './components/policy.component';
import { TermsComponent } from './components/terms.component';
import { NotifyService } from '../../services/utils/notify.service';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [ 
      CommonModule,
      HttpModule,
      UtilsModule,
      SiteHomeRouting,
      MatIconModule
    ],
    declarations: [
      HomeComponent,
      SuccessComponent,
      ErrorComponent,
      TermsComponent,
      PolicyComponent
    ],
    providers: [
      NotifyService
    ],
    bootstrap:    [   ]
})
export class SiteHomeModule { }