import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { RoleListComponent } from './components/list.component';
import { RoleCreateComponent } from './components/create.component';

/* Routes */
import { AdminRoleRouting } from './admin.role.routes';
import { MatIconModule, MatButtonModule, MatTab, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';
import { RoleModulesComponent } from './components/modules.component';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminRoleRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatCardModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatCheckboxModule
    ],
    declarations: [
      RoleListComponent,
      RoleCreateComponent,
      RoleModulesComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminRoleModule { }