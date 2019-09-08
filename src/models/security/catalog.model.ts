import { IUser } from "./user.model";

export interface ICatalog{
    _id: string;
    group: string;
    order: string;
    name: string;
    description?: string;
    description2?: string;
    create_date: Date;
    create_user: IUser;
}
export class CatalogModel implements ICatalog{
    _id: string;
    group: string;
    order: string;
    name: string;
    description?: string;
    description2?: string;
    create_date: Date;
    create_user: IUser;
    constructor(){
    }
}