import { ICategory } from "./category.model";
import { IPerson, PersonModel } from "../security/person.model";
import { IUser } from "../security/user.model";
import { IMedia } from "./media.model";
import { ICatalog, CatalogModel } from "../security/catalog.model";
import { ISection } from "./section.model";

export interface ITraining{
    _id: string;
    title: string
    description:string;
    media?: IMedia;
    tags: string[];
    publish_date: Date;
    language: ICatalog;
    category: ICategory;
    is_free: boolean;
    price: number;
    
    status: ICatalog;
    create_date: Date;
    create_user: IUser;

    section:ISection;
}

export class TrainingModel implements ITraining{
    _id: string;
    title: string
    description:string;
    media?: IMedia;
    tags: string[];
    publish_date: Date;
    language: ICatalog;
    category: ICategory;
    is_free: boolean;
    price: number;
    status: ICatalog;
    create_date: Date;
    create_user: IUser;

    section:ISection;

    constructor(){
        this.status = new CatalogModel();
        this.language = new CatalogModel();
        this.tags = [];
        this.is_free = true;
    }
}