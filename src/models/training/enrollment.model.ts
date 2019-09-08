import { IUser } from "../security/user.model";
import { ISection } from "./section.model";
import { IPerson } from "../security/person.model";
import { ICatalog } from "../security/catalog.model";
import { ITraining } from "./training.model";

export interface IEnrollment{
    _id: string;
    section: ISection;
    person: IPerson;
    enrollment: IEnrollment;
    status: ICatalog;
    percentage?: number;
    end_date?: Date;
    create_date: Date;
    create_user: IUser;

    training: ITraining;
}

export class EnrollmentModel implements IEnrollment{
    _id: string;
    section: ISection;
    person: IPerson;
    enrollment: IEnrollment;
    status: ICatalog;
    percentage?: number;
    end_date?: Date;
    create_date: Date;
    create_user: IUser;

    training: ITraining;

    constructor(){
    }
}