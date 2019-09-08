import { IUser } from "../security/user.model";
import { ICatalog, CatalogModel } from "../security/catalog.model";

export interface IMedia{
    _id: string;
    name: string;
    type: ICatalog;
    url: string;
    thumbnail: string;
    duration: number; 

    create_date: Date;
    create_user: IUser;
}

export class MediaModel implements IMedia{
    _id: string;
    name: string;
    type: ICatalog;
    url: string;
    thumbnail: string;
    duration: number; 

    create_date: Date;
    create_user: IUser;

    constructor(){
        this.type = new CatalogModel();
    }
}