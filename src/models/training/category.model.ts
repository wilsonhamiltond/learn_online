import { IUser } from "../security/user.model";

export interface ICategory{
    _id: string;
    name: string;
    description: string;
    parent_category?: ICategory;

    create_date: Date;
    create_user: IUser;
}

export class CategoryModel implements ICategory{
    _id: string;
    name: string;
    description: string;
    parent_category?: ICategory;

    create_date: Date;
    create_user: IUser;

    constructor(){
    }
}