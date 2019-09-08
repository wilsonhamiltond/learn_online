import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { CategoryListComponent } from './components/list.component';
import { CategoryCreateComponent } from './components/create.component';

/* Routes */
import { AdminCategoryRouting } from './admin.category.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminCategoryRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatOptionModule,
      MatAutocompleteModule
    ],
    declarations: [
      CategoryListComponent,
      CategoryCreateComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminCategoryModule { }