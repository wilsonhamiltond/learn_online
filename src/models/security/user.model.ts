import { IRole } from './role.model'
import { IModule } from './module.model';
import { ICatalog, CatalogModel } from './catalog.model';
import { IPerson, PersonModel } from './person.model';
import { USER_TYPE_ENUM } from '../../services/security/user.service';

export interface IUser{
    _id: string;
    password: string;
    user_name: string;
    type: string;
    modules: IModule[];
    person: IPerson;
    roles: IRole[];
    status: ICatalog;

    last_password:string;
    password_confirm:string;
    keep_login: boolean;
}

export class UserModel implements IUser{
    _id: string;
    password: string;
    type: string;
    modules: IModule[];
    user_name: string;
    person: IPerson;
    roles: IRole[];
    status: ICatalog;

    last_password:string;
    password_confirm:string;
    keep_login: boolean;

    constructor(){
        this.modules = [];
        this.person = new PersonModel();
        this.status = new CatalogModel();
        this.type = USER_TYPE_ENUM.local;
        this.roles = [];
    }
}
