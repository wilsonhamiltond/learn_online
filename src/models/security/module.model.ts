export interface IModule{
    _id: string;
    name: string;
    url: string;
    add: Boolean;
    edit: Boolean;
    delete: Boolean;
    print: Boolean;
    create_date: Date;
    create_user: Object;
}

export class ModuleModel implements IModule{
    _id: string;
    name: string;
    url: string;
    add: Boolean;
    edit: Boolean;
    delete: Boolean;
    print: Boolean;
    create_date: Date;
    create_user: Object;
    
    constructor(){
    }
}