import { IStage } from './stage.model';
import { ICatalog } from '../security/catalog.model';
import { IPracticeResponse } from './practice.response.model';
import { IMessage } from './message.model';

export interface IForum{
    _id:  string;
    stage: IStage;
    name: String;
    description: String;
    order: Number;
    status: ICatalog;

    messages: IMessage[];
}
export class ForumModel implements IForum{
    _id:  string;
    stage: IStage;
    name: String;
    description: String;
    order: Number;
    status: ICatalog;

    messages: IMessage[];
    constructor(){
        
    }
}