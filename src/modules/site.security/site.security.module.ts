import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';

/* Routes */
import { SiteSecurityRouting } from './site.security.routes';

/* component */

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { VerifyComponent } from './components/verify.component';
import { RecoverComponent } from './components/recover.component';
import { RecoverPasswordComponent } from './components/recover.password.component';
import { MatInputModule, MatCheckboxModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    UtilsModule,
    SiteSecurityRouting
  ],
  declarations: [
    RecoverPasswordComponent,
    LoginComponent,
    RegisterComponent,
    RecoverComponent,
    VerifyComponent
  ],
  bootstrap: []
})
export class SiteSecurityModule { }