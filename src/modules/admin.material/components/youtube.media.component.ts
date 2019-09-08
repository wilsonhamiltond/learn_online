import { Component, OnInit, Input } from '@angular/core';
import { IMedia } from '../../../models/training/media.model';

@Component({
    selector: 'youtube-media',
    templateUrl: './youtube.media.component.html'
})
export class YoutubeMediaComponent implements OnInit {
    @Input()
    media: IMedia;

    constructor() { }

    ngOnInit() { 
        let media:any = Object.assign({}, this.media);
        media.type = '5b89a233b923843534cf540e';
        this.media.type = media.type;
    }

}