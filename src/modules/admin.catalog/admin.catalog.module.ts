import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { CatalogListComponent } from './components/list.component';
import { CatalogCreateComponent } from './components/create.component';

/* Routes */
import { AdminCatalogRouting } from './admin.catalog.routes';
import { MatIconModule, MatButtonModule, MatTab, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminCatalogRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule    
    ],
    declarations: [
      CatalogListComponent,
      CatalogCreateComponent
    ],
    providers: [
      NotifyService
    ],
    bootstrap:    [ ]
})
export class AdminCatalogModule { }