import { IQuestion } from "./question.model";
import { IUser } from "../security/user.model";
import { IOption } from "./option.model";
import { ITest } from "./test.model";
import { IPerson } from "../security/person.model";
import { IEnrollment } from "./enrollment.model";

export interface IQuestionResponse{
    _id: string;
    question: IQuestion;
    enrollment: IEnrollment;
    options: IOption[];
    test: ITest;
    person: IPerson;
    restant_time: Number;
    create_date: Date;
    create_user: IUser;
}

export class QuestionResponseModel implements IQuestionResponse{
    _id: string;
    question: IQuestion;
    enrollment: IEnrollment;
    options: IOption[];
    test: ITest;
    restant_time: Number;
    person: IPerson;
    create_date: Date;
    create_user: IUser;
    
    constructor(){
        this.options = [];
    }
}