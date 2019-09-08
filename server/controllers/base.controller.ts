import { Response, Request} from 'express'
import { BaseModel } from '../models/base.model'
import { Schema, mongo } from 'mongoose'

export class BaseController{
    public model: BaseModel;
    public document_name:string;

    constructor( model?:BaseModel, document_name?:string, schema?:Schema, config?:any){
        this.document_name = document_name
        if( model )
            this.model = model
        else{
            if(config)
                this.model = new BaseModel(schema, document_name, config)
            else
                this.model = new BaseModel(schema, document_name)
        }
    }

    async list( req: Request, res:Response){
        try{
            let params:any = {};
            params['$or'] = [{
                'setting._id': req['session'].user.setting._id
            },
            {
                setting: { $exists: false }
            }]
            let docs = await this.model.list(params)
            res.json({
                result: true,
                docs: docs
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error cargando listado de ${this.document_name}`
            })
        }
    }

    async get( req: Request, res:Response, populate?:boolean){
        try{
            let _id:string = req.params['_id'],
            doc = await this.model.get(_id, populate);
            res.json({
                result: true,
                doc: doc
            })
        }catch(error){
            res.json({
                result: false,
                error: error,
                message: `Error buscando ${this.document_name}`
            })
        }
    }

    async save( req: Request, res:Response){
        try{
            let object:any = req.body
            delete object['_id']
            object.create_user = new  mongo.ObjectId( req['session'].user._id );
            object.setting = new mongo.ObjectId(  req['session'].user.setting._id )
            object.create_date = new Date();      
            object.update_date = new Date();
            let doc = await this.model.save(object);
            res.json({
                result: true,
                doc: doc,
                message: `${this.document_name} guardado correctamente.`
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error guardando ${this.document_name}`
            })
        }
    }
    
    async update( req: Request, res:Response){
        try{
            let _id:string = req.params['_id'],
            object:any = req.body;
            object.update_date = new Date()
            if( !object.setting )
                object.setting = req['session'].user.setting;
            let message = await this.model.update(_id, object);
            res.json({
                result: true,
                doc: object,
                message: `${this.document_name} actualizado correctamente.`
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error actualizando ${this.document_name}`
            })
        }
    }

    async delete( req: Request, res:Response){
        try{
            let _id:string = req.params['_id']
            let message = await this.model.delete(_id)
            res.json({
                result: true,
                message: message
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error borrando ${this.document_name}`
            })
        }
    }
    
    private replaceRegEx(obj:any){
        for( let prop in obj){
            var o = obj[prop];
            if(typeof(o) == 'string' ){
                if(o.length > 3 && o[0] == '/' && o[o.length -1] == '/'){
                    o = o.replace(new RegExp('/', 'g'), '')
                    obj[prop] = new RegExp(o, "gi");
                }
            }
            else if(typeof(o) == 'object' && o.length >= 0 && prop.indexOf('$') < 0)
                obj[prop] = o;
            else if(typeof(o) == 'object')
                obj[prop] = this.replaceRegEx(o);
        }
        return obj;
    }
    
    async filter( req: Request, res:Response){
        try{
            req.body.params = this.add_object_id(req.body.params)
            let params:any = this.replaceRegEx(req.body.params) || {},
                fields:any = req.body.fields || {},
                sort = req.body.sort || {},
                limit = req.body.limit || 0,
                skip = req.body.skip;
            
            params['setting'] = new mongo.ObjectId( req['session'].user.setting._id );

            let docs = await this.model.filter(params, fields, sort, skip, limit)
            res.json({
                result: true,
                docs: docs
            })
        }catch(error){
            res.json( {
                result: false,
                error: error,
                message: `Error filtrando ${this.document_name}`
            })
        }
    }

    async size( req: Request, res:Response){
        try{
            req.body.params = this.add_object_id(req.body.params)
            let params:any = this.replaceRegEx(req.body.params) || {};
            
            params['setting'] = new mongo.ObjectId( req['session'].user.setting._id );

            let size:number = await this.model.size(params);
            res.json({
                result: true,
                size: size
            })
        }catch(error){
            res.json( {
                result: false,
                message: error
            })
        }
    }
    
    
    public add_object_id(object:any){
        let match = {};
        for(let prop in (object || {})){
            if(object[prop].object_id){
                if(object[prop].values)
                    match[prop] = object[prop].values.map( (value:string) =>{ return new mongo.ObjectId(value )});
                if(object[prop].value)
                    match[prop] = new mongo.ObjectId( object[prop].value )
            }else if(typeof(object[prop]) == 'object' && object[prop].length >= 0)
                match[prop] = object[prop];
            else if( typeof(object[prop]) == 'object'){
                match[prop] = this.add_object_id(object[prop]);
            }else{
                match[prop] = object[prop];
            }
        }
        return match;
    }

    async aggregate( req: Request, res:Response){
        try{
            let $match:any = this.add_object_id(req.body.$match),
                disk_usage:any = req.body.disk_usage || false;
            
            $match['setting'] = new mongo.ObjectId( req['session'].user.setting._id );
            
            let docs = await this.model.aggregate($match, req.body.$project, req.body.$group, req.body.$lookup, disk_usage)
            res.json({
                result: true,
                docs: docs
            })
        }catch(error){
            res.json( {
                result: false,
                message: error
            })
        }
    }
}