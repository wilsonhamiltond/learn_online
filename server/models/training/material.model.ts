
import { BaseModel } from '../base.model';
import { MediaSchema } from '../../schemas/training/media.schema';
import { MaterialSchema } from '../../schemas/training/material.schema';

export class MaterialModel extends BaseModel{
    constructor( ){
        super(MaterialSchema, 'material');
    }
    
    async save( _material:any){
        try{
            let mediaModel = new BaseModel(MediaSchema, 'media');
                
            _material.media.setting = _material.setting;
            _material.media.create_user = _material.create_user;
            _material.media.create_date = _material.create_date;

            let media = await mediaModel.save(_material.media);
            _material.media = media._id;

            let material = await super.save(_material);
            return material
        }catch(error){
            console.log(error)
            return `Error guardando el material.`
        }
    }

    async update(_id:string, _material:any){
        try{
            let mediaModel = new BaseModel(MediaSchema, 'media');
            await mediaModel.update(_material.media._id, _material.media);
            return await super.update(_id, _material)
        }catch(error){
            console.log(error)
            return `Error actualizando el material`
        }
    }
}