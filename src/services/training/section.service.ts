import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

export enum SECTION_STATUS_ENUM{
    subcription = '5b8964ee6fc79c21147f5aa9',
    in_progres = '5b8964f96fc79c21147f5aaa',
    ended = '5b8965066fc79c21147f5aab',
    canceled = '5b89650e6fc79c21147f5aac'
}

@Injectable()
export class SectionService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'section')
    }
}