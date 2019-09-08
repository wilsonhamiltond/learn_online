import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';
import { IEnrollment } from '../../models/training/enrollment.model';

export enum ENROLLMENT_STATUS_ENUM{
    subscribed = '5b8da43e3808103abc8e61f5',
    retired = '5b8da4603808103abc8e61f6',
    removed = '5b8da4683808103abc8e61f7',
    finished = '5b8da4703808103abc8e61f8'
}

@Injectable()
export class EnrollmentService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'enrollment')
    }

    complete(enrollment:IEnrollment){
        return this.request( 'post', `${this.base_url}/complete`, enrollment);
    }
    
    history( ){
        return this.request( 'get', `${this.base_url}/training/history`);
    }

    download(enrollment:IEnrollment){
        return this.request( 'post', `${this.base_url}/download`, enrollment);
    }
}