
import { ISection } from './section.model';
import { IMedia, MediaModel } from './media.model';
import { IUser } from '../security/user.model';
import { IModule } from '../security/module.model';
import { IStage } from './stage.model';
import { ICatalog, CatalogModel } from '../security/catalog.model';
import { IMaterialView } from './material.view.model';

export interface IMaterial{
    _id:  string;
    stage: IStage;
    name: string;
    description: string;
    order: number;
    type: ICatalog;
    media: IMedia;
    status: ICatalog;
    create_date:Date;
    create_user: IUser;

    viewed: boolean;
    materialview: IMaterialView[];
}
export class MaterialModel implements IMaterial{
    _id:  string;
    stage: IStage;
    name: string;
    description: string;
    order: number;
    type: ICatalog;
    media: IMedia;
    status: ICatalog;
    create_date:Date;
    create_user: IUser;
    
    viewed: boolean;
    materialview: IMaterialView[];
    constructor(){
        this.media = new MediaModel();
        this.type = new CatalogModel();
    }
}