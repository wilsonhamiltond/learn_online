import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';
import { IContact } from '../../models/security/contact.model';

@Injectable()
export class SettingService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'setting')
    }
    
    current() {
        return this.request( 'get', `${this.base_url}/get/current`);
    }
    contact(contact:IContact){
        return this.request( 'post',`${this.base_url}/contact`, contact);
    }
}