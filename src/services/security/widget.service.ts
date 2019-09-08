import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

@Injectable()
export class WidgetService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'widget')
    }
}