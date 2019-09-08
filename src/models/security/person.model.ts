
export interface IPerson{
    _id: string;
    name: string;
    last_name?: string;
    email: string;
    avatar_url?: string;
    gender?: string;
    birthdate?: Date
    summary?: string;
    document_type? : string;
    document_number?: string; 
}

export class PersonModel implements IPerson{
    _id: string;
    name: string;
    last_name?: string;
    email: string;
    avatar_url?: string;
    gender?: string;
    birthdate?: Date
    summary?: string;
    document_type? : string;
    document_number?: string; 
    
    constructor(){
    }
}