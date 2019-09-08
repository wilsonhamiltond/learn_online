import { ITraining } from "./training.model";
import { IUser } from "../security/user.model";
import { ISection } from "./section.model";
import { IMaterial } from "./material.model";
import { ITest } from "./test.model";

export interface IStage{
    _id: string;
    training: ITraining;
    section: ISection;
    name: string;
    start_date: Date;
    end_date: Date;
    status: string;
    create_date: Date;
    create_user: IUser;

    materials: IMaterial[];
    tests: ITest[];
}

export class StageModel implements IStage{
    _id: string;
    training: ITraining;
    section: ISection;
    name: string;
    start_date: Date;
    end_date: Date;
    status: string;
    create_date: Date;
    create_user: IUser;
    
    materials: IMaterial[];
    tests: ITest[];
    
    constructor(){
    }
}