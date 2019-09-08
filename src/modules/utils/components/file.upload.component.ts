import { Component, OnInit, NgZone, Output, EventEmitter, Input } from '@angular/core';
import { CatalogService } from '../../../services/security/catalog.service';
import { IMedia, MediaModel } from '../../../models/training/media.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { IResponse } from '../../../models/utils/response.model';
import { OnProgress, BaseService } from '../../../services/base.service';
import { ConfirmDialog } from './confirm.dialog';
import { MatDialog } from '@angular/material';


@Component({
    selector: 'file-upload',
    styles: [`
        .circle-container{
            width: 48px;
            height: 48px;
            left: 50%;
            position: relative;
            margin-left: -50px;
        }
        .circle-container mat-progress-spinner{
            width: 48px;
            height: 48px;
        }
        .circle-container span.number{
            font-size: 8pt;
            color: #1abc9c;
            position: relative;
            top: -60px;
            left: 35px;
        }
    `],
    templateUrl: './file.upload.component.html',
    providers: [CatalogService]
})
export class FileUploadComponent implements OnInit {
    @Output()
    onUpload = new EventEmitter();

    @Output()
    onDelete = new EventEmitter();

    @Input()
    media: IMedia;

    @Input()
    service: BaseService

    current_media: IMedia;
    file_types: Array<ICatalog> = [];
    loading: boolean = false;
    progress: number = 0;

    constructor(
        private catalogService: CatalogService,
        private zone: NgZone,
        private dialog: MatDialog
    ) {
        this.media = new MediaModel();
        this.current_media = new MediaModel();

        OnProgress.subscribe((progress: number) => {
            this.progress = progress;
            this.zone.run(() => { });
        });
    }
    setMediaVideo(media_video: IMedia) {
        this.media = media_video;
        this.current_media = media_video;
        this.zone.run(() => { });
    }

    ngOnInit() {
        this.catalogService.file_types().subscribe((response: IResponse) => {
            if (response.result == true) {
                this.file_types = <Array<ICatalog>>response.docs;
            }
        })
    }

    changeFile(e: any) {
        if (e.target.files.length != 0) {
            var file = e.target.files[0];
            this.loading = true;
            this.service.upload(file).subscribe((response: IResponse) => {
                if (response.result) {
                    this.current_media.name = response.file.originalname;
                    this.current_media.url = response.file.filename;
                    this.media = this.current_media;
                    this.onUpload.next(this.media);
                } else {
                    alert(response.message);
                }
                this.loading = false;
                this.zone.run(() => { });
            });
        } else {
            this.current_media.url = '';
            this.current_media.name = '';
            this.media = this.current_media;
        }
    }

    delete(element: any) {

        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.load({
            message: '¿Desea borrar este archivo?',
            title: 'CONFIRMACIÓN',
            cancel: 'No',
            accent: 'Si'
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                element.value = '';
                this.media.url = '';
                this.media.name = '';
                this.media = this.current_media;
                this.onDelete.next(undefined);
            }
        });
    }
}