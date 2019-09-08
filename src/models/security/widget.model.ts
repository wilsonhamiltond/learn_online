
export interface IWidget{
    _id: string;
    description: string;
    name: string;
    order: Number;
    size: string;
    create_date: Date;
    create_user: Object;
}

export class IWidgetModel implements IWidget{
    _id: string;
    description: string;
    name: string;
    size: string;
    order: Number;
    create_date: Date;
    create_user: Object;
    
    constructor(){
    }
}