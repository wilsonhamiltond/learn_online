import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

export enum MEDIA_TYPE_ENUM{
    youtube = '5b89a233b923843534cf540e',
    mp4 = '5b899c716588d104d495288d',
    drive_video = '5cb5edf9eb1cc4102dd29236'
}

@Injectable()
export class MediaService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'media')
    }
}