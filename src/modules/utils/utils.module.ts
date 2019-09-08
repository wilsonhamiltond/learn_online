import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadComponent } from './components/file.upload.component';
import { LoadingComponent } from './components/loading.component';
import { VideoPlayerComponent } from './components/video.player.component';
import { MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, MatDialogModule, MatButtonModule, MatSelectModule, MatOptionModule } from '@angular/material';
import { TemplateComponent } from './components/template.component';
import { RouterModule } from '@angular/router';
import { ConfirmDialog } from './components/confirm.dialog';
import { NotifyTemplateComponent } from './components/notify.template.component';
import { FilterPipe } from './components/filter.pipe';
import { SortPipe } from './components/sort.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatSnackBarModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule
    ],
    declarations: [ 
        FileUploadComponent, 
        LoadingComponent,
        VideoPlayerComponent,
        TemplateComponent,
        FilterPipe,
        SortPipe,
        ConfirmDialog,
        NotifyTemplateComponent
    ],
    exports: [
        FileUploadComponent,
        LoadingComponent,
        VideoPlayerComponent,
        ConfirmDialog,
        FilterPipe,
        SortPipe,
        NotifyTemplateComponent
    ],
    bootstrap:    [ ],
    entryComponents: [
        ConfirmDialog,
        NotifyTemplateComponent
    ]
})
export class UtilsModule { }