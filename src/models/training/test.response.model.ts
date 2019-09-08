import { IUser } from '../security/user.model';
import { IQuestion, QuestionModel} from './question.model';

export interface ITestResponse{
    _id: string;
    question: IQuestion;
    options: Array<any>;
    create_date: Date;
    create_user: IUser;
}

export class TestResponseModel implements ITestResponse{
    _id: string;
    question: IQuestion;
    options: Array<any>;
    create_date: Date;
    create_user: IUser;

    constructor(){
        this.question = new QuestionModel();
        this.options = [];
    }
}