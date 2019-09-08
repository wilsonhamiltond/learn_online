import { IUser } from "../security/user.model";

export interface ISetting{
    _id: string;
    name: String;
    description?: String;
    email: String;
    logo: String;
    latitude: Number;
    longitude: Number;
    zoon: Number;
}

export class SettingModel implements ISetting{
    _id: string;
    name: String;
    description?: String;
    email: String;
    logo: String;
    latitude: Number;
    longitude: Number;
    zoon: Number;

    constructor(){
    }
}