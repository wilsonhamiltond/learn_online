import { IUser } from "../security/user.model";
import { ICatalog } from "../security/catalog.model";
import { IStage } from "./stage.model";
import { IQuestion } from "./question.model";
import { IQuestionResponse } from "./question.response.model";

export interface ITest{
    _id: string;
    name: string;
    description: string;
    time: number;
    stage: IStage;
    status: ICatalog;
    create_date: Date;
    create_user: IUser;

    questions: IQuestion[];
    responses: IQuestionResponse[];
    completed:boolean;
}

export class TestModel implements ITest{
    _id: string;
    name: string;
    description: string;
    time: number;
    stage: IStage;
    status: ICatalog;
    create_date: Date;
    create_user: IUser;
    
    questions: IQuestion[];
    responses: IQuestionResponse[];
    completed:boolean;

    constructor(){
    }
}