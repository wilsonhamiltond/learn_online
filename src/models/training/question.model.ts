import { ITest } from "./test.model";
import { IUser } from "../security/user.model";
import { IQuestionResponse } from "./question.response.model";

export interface IQuestion{
    _id: string;
    description: string;
    type: string;
    value: number;
    status: string;
    test: ITest;
    options: Object[];
    responses: Object[];
    create_date: Date;
    create_user: IUser;
    
    restant_time: number;
    response:IQuestionResponse;
}
export class QuestionModel implements IQuestion{
    _id: string;
    description: string;
    type: string;
    value: number;
    status: string;
    test: ITest;
    options: Object[];
    responses: Object[];
    create_date: Date;
    create_user: IUser;
    
    restant_time: number;
    response:IQuestionResponse;

    constructor(){
        this.options = [];
        this.responses = [];
    }
}