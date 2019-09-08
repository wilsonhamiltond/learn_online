import { Component, OnInit, Input } from '@angular/core';
import { IMedia } from '../../../models/training/media.model';
import { MEDIA_TYPE_ENUM } from 'src/services/training/media.service';

@Component({
    selector: 'google-drive-media',
    templateUrl: './google.drive.media.component.html'
})
export class GoogleDriveMediaComponent implements OnInit {
    @Input()
    media: IMedia;

    constructor() { }

    ngOnInit() { 
        let media:any = Object.assign({}, this.media);
        media.type = MEDIA_TYPE_ENUM.drive_video;
        this.media.type = media.type;
    }

}