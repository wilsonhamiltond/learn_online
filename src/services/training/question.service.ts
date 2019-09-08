import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

@Injectable()
export class QuestionService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'question')
    }
    next(test_id:string, enrollment_id:any){
        return this.request( 'get', `${this.base_url}/${test_id}/${enrollment_id}/next`);
    }
}