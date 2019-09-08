import { ITraining } from "./training.model";
import { IUser } from "../security/user.model";
import { IStage } from "./stage.model";
import { IPerson } from "../security/person.model";

export interface ISection{
    _id: string;
    training: ITraining;
    code: string;
    start_date: Date;
    end_date: Date;
    tutorial: boolean;
    author: IPerson;
    percentage: number;
    status: string;
    create_date: Date;
    create_user: IUser;

    stages: IStage[];
}

export class SectionModel implements ISection{
    _id: string;
    training: ITraining;
    code: string;
    start_date: Date;
    end_date: Date;
    percentage: number;
    author: IPerson;
    tutorial: boolean;
    status: string;
    create_date: Date;
    create_user: IUser;

    stages: IStage[];
    
    constructor(){
        this.stages = [];
    }
}