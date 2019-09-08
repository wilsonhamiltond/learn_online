import * as mongoose from 'mongoose'
import { Model, Document, Schema } from 'mongoose'
import { join } from 'path';
import * as fs from 'fs';
import { MailModel } from './security/mail.model';

export class BaseModel{
    public model: Model<Document>
    public schema: Schema
    public document_name:string
    public config: any;
    public populates:string[] = [];

    constructor( schema:Schema, document:string, config?:any){
        this.schema = schema
        this.document_name = document
        if(schema){
            for( let prop in schema.obj){
                if(schema.obj[prop].ref || (schema.obj[prop][0] && schema.obj[prop][0].ref) ){
                    this.populates.push(prop);
                }
            }
            for(let prop in schema['virtuals']){
                if(prop != 'id')
                    this.populates.push(prop);
            }
        }
        try{
            this.model = mongoose.model(document, this.schema)
        }catch(e){
            this.model = mongoose.model(document)
        }
        this.config = config;
    }
    
    async list( params:any ){
        try{
            let docs:Array<any> = await this.model.find( params)
            return docs.map( (doc:any) => {return  doc.toJSON()})
        }catch(error){
            console.log(error)
            throw new Error(`Error listado de ${this.document_name}.`)
        }
    }
    
    async get( _id:string, populate?: boolean ){
        try{
            let request = this.model.findOne( {'_id': _id});
            if(populate){
                for ( let i = 0; i < this.populates.length; i++){
                    let populate: string = this.populates[i];
                    request = request.populate(populate);
                }
            }
            let response:any = await request.exec();
            return response.toJSON()
        }catch( error ){
            console.log(error);
            throw new Error(`Error buscando ${this.document_name}.`)
        }
    }
    
    async delete( _id:string ){
        try{
            let response:any = await this.model.remove( {_id: _id})
            return `${this.document_name} borrado correctamente.`
        }catch(error){
            console.log(error)
            throw new Error(`Error borrando ${this.document_name}.`)
        }
    }
    
    async upload(_object:any){
        try{
            let setting_id = this.document_name != 'setting'? _object.setting.toString() : _object._id.toString();
            _object[this.config.upload_name] = _object[this.config.upload_name]? _object[this.config.upload_name] : '';
            let path = join(  process.cwd(), 'public', 'files', setting_id, this.document_name ),
                old_path = join(process.cwd(), 'public','files', 'temps', _object[this.config.upload_name]); 
            _object[this.config.upload_name] = _object[this.config.upload_name] || join(process.cwd(), 'files', setting_id, 'empty.png');
            if(!fs.existsSync(path)){
                fs.mkdirSync(path);
            }
            if( fs.existsSync(old_path)){
                await fs.renameSync( old_path , join(path, `${_object._id.toString()}.png`) )
                _object[this.config.upload_name] = `files/${setting_id}/${this.document_name}/${_object._id.toString()}.png`
            }
        }catch(error){ }
    }

    async save( _object:any){
        try{
            let obj = new this.model( _object ),
            doc:any = await obj.save()
            if(this.config){
                if(this.config.upload_name)
                    await this.update(doc._id, doc);
            }
            return doc.toJSON()
        }catch(error){
            console.log(error)
            throw new Error(`Error guardando ${this.document_name}.`)
        }
    }
    
    async saveMeny( _objects:Array<any>){
        try{
            let docs:any = await this.model.create( _objects )
            return docs.map( (doc:any) => {return  doc.toJSON()})
        }catch(error){
            console.log(error)
            throw new Error(`Error guardando ${this.document_name}.`)
        }
    }
    
    async update( _id:string, _object:any){
        try{
            if(this.config){
                if(this.config.upload_name)
                    await this.upload(_object);
            }
            let response:any = await this.model.update( {_id: _id}, _object, {}); 
            return `${this.document_name} actualizado correctamente.`
        }catch(error){
            console.log(error)
            throw new Error(`Error actualizando ${this.document_name}`)
        }
    }
    
    async filter( params:any, fields?:any, sort?:any, skip?:any, limit?:number){
        try{
            let docs:Array<any> = [],
                match:any = params.match,
                populate_fields:any = {};
            
            for( let prop in fields){
                if(typeof (fields[prop]) == 'object'){
                    populate_fields[prop] = fields[prop];
                    delete fields[prop];
                }
            }
            delete params.match;
            let query = this.model.find( params, fields );
            if(sort)
                query.sort(sort);
            if(skip)
                query.skip(skip);
            if(limit)
                query.limit(limit);
            this.populates.forEach( (collection: string) =>{
                let populate = {
                    path: collection
                };
                if(match && match[collection])
                    populate['match'] = match[collection];
                if(populate_fields[collection]){
                    populate['select'] = populate_fields[collection]
                    query.populate(populate);
                }else{
                    if(!fields)
                        query.populate(populate);
                }

            })
            docs = await query.exec();
            return docs.map( (doc:any) => {return  doc.toJSON()});
        }catch(error){
            console.log(error)
            throw new Error(`Error filtrando datos de ${this.document_name}.`)
        }
    }
    
    async size(params:any){
        try{
            let size: number = await this.model.count(params).exec();
            return size;
        }catch(error){
            console.log(error)
            throw new Error(`Error cargando cantidad de ${this.document_name}.`)
        }
    }

    async aggregate( match?:any, project?:any, group?:any, lookup?:any, unwind?:any, disk_usage:boolean = false){
        try{
            let aggregates = [];
            if(match)
                aggregates.push({
                    $match: match
                })
            if(project)
                aggregates.push({
                    $project: project
                })
            if(unwind)
                aggregates.push({
                    $unwind: unwind
                })
            if(lookup)
                aggregates.push({
                    $lookup: lookup
                })
            if(group)
                aggregates.push({
                    $group: group
                })
            let docs:Array<any> = await this.model.aggregate( aggregates ).exec();
            return docs;
        }catch(error){
            console.log(error)
            throw new Error(`Error filtrando datos de ${this.document_name}.`)
        }
    }
    
    async send_mail(message:any){
        try{
            let template_path = join( process.cwd(), 'public', 'files', message.setting_id, 'templates', 'mails', message.template ),
                html:string = fs.readFileSync(template_path, "utf8");
            await new MailModel().send(null, message.to, message.subject, html);
            return `Se ha enviado el correo de ${this.document_name} correctamente.`
        }catch(error){
            console.log(error)
            throw new Error(`Error enviando correo ${this.document_name}`)
        }
    }
}