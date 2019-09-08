import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { PasswordComponent } from './components/password.component';
import { UserComponent } from './components/user.component';

/* Routes */
import { ProfileSecurityRouting } from './profile.security.routes';
import { MatIconModule, MatSelectModule, MatOptionModule, MatProgressSpinnerModule, MatInputModule, MatTooltipModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';


import { CKEditorModule } from 'ngx-ckeditor';
@NgModule({
  imports: [
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    UtilsModule,
    ProfileSecurityRouting,
    MatTooltipModule,
    CKEditorModule
  ],
  declarations: [
    PasswordComponent,
    UserComponent
  ],
  providers: [NotifyService],
  bootstrap: []
})
export class ProfileSecurityModule { }