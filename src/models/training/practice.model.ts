import { IStage } from './stage.model';
import { ICatalog } from '../security/catalog.model';
import { IPracticeResponse } from './practice.response.model';

export interface IPractice{
    _id:  string;
    attacemnt: String;
    stage: IStage;
    name: String;
    description: String;
    order: Number;
    status: ICatalog;

    responses: IPracticeResponse[];
}
export class PracticeModel implements IPractice{
    _id:  string;
    attacemnt: String;
    stage: IStage;
    name: String;
    description: String;
    order: Number;
    status: ICatalog;

    responses: IPracticeResponse[];
    constructor(){
        
    }
}