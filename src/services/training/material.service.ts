import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

export enum MATERIAL_TYPE_ENUM{
    youtube = '5b899d096588d104d495288f',
    local = '5b899cf06588d104d495288e',
    embed = '5ba3b7edfd74ea142cad3442',
    google_drive = '5cb6257e587489227c05a871'
}

@Injectable()
export class MaterialService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'material')
    }
}