import { IPerson } from "../security/person.model";
import { IMaterial } from "./material.model";
import { IEnrollment } from "./enrollment.model";

export interface IMaterialView{
    _id:  string;
    material: IMaterial;
    enrollment: IEnrollment;
    person: IPerson;
    create_date:Date;
}
export class MaterialViewModel implements IMaterialView{
    _id:  string;
    material: IMaterial;
    enrollment: IEnrollment;
    person: IPerson;
    create_date:Date;

    constructor(){
    }
}