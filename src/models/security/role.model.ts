import { IModule } from './module.model'
import { IWidget } from './widget.model';
import { IUser } from './user.model';

export interface IRole{
    _id: string;
    name: string;
    description: string;
    actived: Boolean;
    modules: IModule[];
    craete_date: Date;
    create_user: IUser;
}

export class RoleModel implements IRole{
    _id: string;
    name: string;
    description: string;
    actived: Boolean;
    modules: IModule[];
    craete_date: Date;
    create_user: IUser;
    
    constructor(){
        this.modules = [];
    }
}