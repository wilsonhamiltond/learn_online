import { IForum } from './forum.model';
import { IPerson } from '../security/person.model';

export interface IMessage{
    _id:  string;
    forum: IForum;
    person: IPerson;
    message: String;

    create_date:Date;
}

export class MessageModel implements IMessage{
    _id:  string;
    forum: IForum;
    person: IPerson;
    message: String;

    create_date:Date;
    constructor(){
        
    }
}