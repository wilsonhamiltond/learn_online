import { IPractice } from './practice.model';
import { IPerson } from '../security/person.model';

export interface IPracticeResponse{
    _id:  string;
    attachment: String;
    practice: IPractice;
    message: String;
    person: IPerson;

}
export class PracticeResponseModel implements IPracticeResponse{
    _id:  string;
    attachment: String;
    practice: IPractice;
    message: String;
    person: IPerson;
    
    constructor(){
        
    }
}