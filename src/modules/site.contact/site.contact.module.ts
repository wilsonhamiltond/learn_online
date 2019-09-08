import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';

/* Routes */
import { SiteContactRouting } from './site.contact.routes';

/* Component */
import { NotifyService } from '../../services/utils/notify.service';

import { MatIconModule, MatInputModule } from '@angular/material';
import { ContactComponent } from './components/contact.component';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      SiteContactRouting,
      MatIconModule,
      MatInputModule
    ],
    declarations: [
      ContactComponent
    ],
    providers: [
      NotifyService
    ],
    bootstrap:    [   ]
})
export class SiteContactModule { }