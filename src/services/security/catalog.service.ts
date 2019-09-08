import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';

@Injectable()
export class CatalogService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'catalog')
    }
    general_status(){
        return this.filter({
            params: {
                group: 'general_status'
            },
            fields: {
                name: true
            }
        });
    }
    material_types(){
        return this.filter({
            params: {
                group: 'material_types'
            },
            fields: {
                name: true
            }
        });
    }
    user_status(){
        return this.filter({
            params: {
                group: 'user_status'
            },
            fields: {
                name: true
            }
        });
    }
    training_status(){
        return this.filter({
            params: {
                group: 'training_status'
            },
            fields: {
                name: true
            }
        });
    }

    section_status(){
        return this.filter({
            params: {
                group: 'section_status'
            },
            fields: {
                name: true
            }
        });
    }

    languages(){
        return this.filter({
            params:{
                group: 'languages'
            },
            fields: {
                name: true
            }
        });
    }
    stage_status(){
        return this.filter({
            params:{
                group: 'stage_status'
            },
            fields: {
                name: true
            }
        });
    }
    question_types(){
        return this.filter({
            params:{
                group: 'question_types'
            },
            fields: {
                name: true
            }
        });
    }
    file_types(){
        return this.filter({
            params:{
                group: 'file_types'
            },
            fields: {
                name: true
            }
        });
    }
    document_types(){
        return this.filter({
            params:{
                group: 'document_types'
            },
            fields: {
                name: true
            }
        });
    }
    genders(){
        return this.filter({
            params:{
                group: 'genders'
            },
            fields: {
                name: true
            }
        });
    }
}