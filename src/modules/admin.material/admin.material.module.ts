import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { NotifyService } from '../../services/utils/notify.service'

/* Components*/
import { MaterialListComponent } from './components/list.component';
import { MaterialCreateComponent } from './components/create.component';

/* Routes */
import { AdminMaterialRouting } from './admin.material.routes';
import { MatIconModule, MatButtonModule, MatTableModule, MatCardModule, MatFormFieldModule, MatPaginatorModule, MatInputModule, MatOptionModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { UtilsService } from '../../services/utils/utils.service';
import { LoadingService } from '../../services/utils/loading.service';
import { YoutubeMediaComponent } from './components/youtube.media.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { EmbedMediaComponent } from './components/embed.media.component';
import { GoogleDriveMediaComponent } from './components/google.drive.media.component';

@NgModule({
  imports: [ 
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      HttpModule,
      UtilsModule,
      AdminMaterialRouting,
      MatIconModule,
      MatButtonModule,
      MatTableModule,
      MatCardModule,
      MatFormFieldModule,
      MatPaginatorModule,
      MatInputModule,
      MatOptionModule,
      MatSelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      CKEditorModule
    ],
    declarations: [
      MaterialListComponent,
      MaterialCreateComponent,
      YoutubeMediaComponent,
      EmbedMediaComponent,
      GoogleDriveMediaComponent
    ],
    providers: [
      NotifyService,
      UtilsService,
      LoadingService
    ],
    bootstrap:    [ ]
})
export class AdminMaterialModule { }