import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BaseService } from '../base.service';
import { ITraining } from 'src/models/training/training.model';

@Injectable()
export class TrainingService extends BaseService {
    constructor(
        public http: Http
    ) { 
        super(http, 'training')
    }

    populars(query?: string){
        if(!query)
            return this.request('get', `${this.base_url}/popular/list`)
        return this.request('get', `${this.base_url}/popular/list/${query}`)
    }
    set_portal(stage_id:string, media_id:string ){
        return this.request('get', `${this.base_url}/${stage_id}/portal/${media_id}`)
    }
    details(_id:string){
        return this.request('get', `${this.base_url}/${_id}/details`)
    }
    subscribed(section:string){
        return this.request('get', `${this.base_url}/${section}/subscribed`);
    }
    
    public getTraining():ITraining{
        let trainingObj = sessionStorage.getItem('ct_section')
        if( trainingObj){
            return <ITraining>JSON.parse(trainingObj);
        }

        return undefined;
    }

    public setTraining(training:ITraining){
        sessionStorage.setItem('ct_section', JSON.stringify(training));
    }
}