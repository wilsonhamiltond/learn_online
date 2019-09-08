import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { UserListComponent } from './components/list.component';
import { UserCreateComponent } from './components/create.component';

/* Routes */
import { AdminUserRouting } from './admin.user.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminUserRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatCardModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatSelectModule,
      MatOptionModule  
    ],
    declarations: [
      UserListComponent,
      UserCreateComponent
    ],
    providers: [
      NotifyService
    ],
    bootstrap:    [ ]
})
export class AdminUserModule { }