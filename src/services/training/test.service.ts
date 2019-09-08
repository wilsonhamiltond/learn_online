import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

@Injectable()
export class TestService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'test')
    }
    details(test_id:string){
        return super.filter({
            params:{
                _id: test_id
            },
            limit: 1
        });
    }
}