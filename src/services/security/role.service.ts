import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

export enum ROLES_SISTEM_ENUM{
    student = '5b8856043d83343590bf37a1',
    admin = '5b883644443e120a1c8e9880',
    teacher = '5b9285d6e6d1713220bd6cb4'
}

@Injectable()
export class RoleService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'role')
    }
}