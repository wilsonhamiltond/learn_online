import { ICatalog } from "../security/catalog.model";

export interface IFileUpload{
    file_type: ICatalog;
    file_name: string;
    file_url: string;    
}