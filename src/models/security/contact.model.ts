import { IUser } from "./user.model";
import { ISection } from "../training/section.model";

export interface IContact{
    name: string;
    email: string;
    text: number;
    create_date: Date;
    create_user?: IUser;
    setting: ISection;
}

export class ContactModel implements IContact{
    name: string;
    email: string;
    text: number;
    create_date: Date;
    create_user?: IUser;
    setting: ISection;
    constructor(){
        
    }
}