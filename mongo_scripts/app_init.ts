import * as config from 'config'
import * as mongoose from 'mongoose'
import { join } from 'path'
import * as fs from 'fs'
import { ModuleSchema } from '../server/schemas/security/module.schema'
import { RoleSchema } from '../server/schemas/security/role.schema'
import { UserSchema } from '../server/schemas/security/user.schema'
import { SettingSchema } from '../server/schemas/security/setting.schema'
import { BaseModel } from '../server/models/base.model'
import { PersonSchema } from '../server/schemas/security/person.schema';
import { CatalogSchema } from '../server/schemas/security/catalog.schema';


declare var process:any
let dbConfig = config.get("dbConfig")
let application_catalogs = [
    {
        "order" : 1,
        "group" : "user_status",
        "name" : "Activo"
    },{
        "order" : 2,
        "group" : "user_status",
        "name" : "Inactivo"
    },{
        "order" : 3,
        "group" : "user_status",
        "name" : "Suspendido"
    }
]

let application_modules = [
    {
        "name" : "Dashboard",
        "url" : "/admin/home"
    },{
        "name" : "Listado de catalogos",
        "url" : "/admin/catalog/list"
    },{
        "name" : "Creación de catalogos",
        "url" : "/admin/catalog/:_id/create"
    },{
        "name" : "Listado de usuarios",
        "url" : "/admin/user/list"
    },{
        "name" : "Creación de usuarios",
        "url" : "/admin/user/:_id/create"
    },{
        "name" : "Listado de perfiles",
        "url" : "/admin/role/list"
    },{
        "name" : "Creación de perfiles",
        "url" : "/admin/role/:_id/create"
    },{
        "name" : "Modulos de perfiles",
        "url" : "/admin/role/:_id/modules"
    },{
        "name" : "Listado de categorias",
        "url" : "/admin/category/list"
    },{
        "name" : "Creación de categoria",
        "url" : "/admin/category/:_id/create"
    },{
        "name" : "Listado de cursos",
        "url" : "/admin/training/list"
    },{
        "name" : "Creación de curso",
        "url" : "/admin/training/:_id/create"
    },{
        "name" : "Listado de secciones",
        "url" : "/admin/section/list"
    },{
        "name" : "Creación de sección",
        "url" : "/admin/section/:_id/create"
    },{
        "name" : "Listado de secciones",
        "url" : "/admin/section/:training_id/list"
    },{
        "name" : "Creación de sección",
        "url" : "/admin/section/:training_id/:_id/create"
    },{
        "name" : "Listado de modulos",
        "url" : "/admin/stage/:section_id/list"
    },{
        "name" : "Creación de modulo",
        "url" : "/admin/stage/:section_id/:_id/create"
    },{
        "name" : "Listado de examenes",
        "url" : "/admin/test/:stage_id/list"
    },{
        "name" : "Creación de examen",
        "url" : "/admin/test/:stage_id/:_id/create"
    },{
        "name" : "Listado de preguntas",
        "url" : "/admin/question/:test_id/list"
    },{
        "name" : "Creación de pregunta",
        "url" : "/admin/question/:test_id/:_id/create"
    },{
        "name" : "Listado de materiales",
        "url" : "/admin/material/:stage_id/list"
    },{
        "name" : "Creación de material",
        "url" : "/admin/material/:stage_id/:_id/create"
    },{
        "name" : "Listado de practicas",
        "url" : "/admin/practice/:stage_id/list"
    },{
        "name" : "Creación de practica",
        "url" : "/admin/practice/:stage_id/:_id/create"
    },{
        "name" : "Listado de foros",
        "url" : "/admin/forum/:stage_id/list"
    },{
        "name" : "Creación de foro",
        "url" : "/admin/forum/:stage_id/:_id/create"
    },
    /* Profiles modules */
    {
        "name" : "Panel de control de usuarios",
        "url" : "/profile/home"
    },
    {
        "name" : "Cambio de clave",
        "url" : "/profile/security/password"
    },{
        "name" : "Modificar mi perfil",
        "url" : "/profile/security/user"
    },{
        "name" : "Historico",
        "url" : "/profile/training/history"
    }
    /* Institute modules */
    ,{
        "name" : "Panel de control del instituto",
        "url": "/institute/:training_id/home"
    },{
        "name" : "Visualizador de materiales",
        "url": "/institute/:training_id/material/:material_id/show"
    },{
        "name" : "Visualizador de examenes",
        "url": "/institute/:training_id/test/:test_id/show"
    },{
        "name" : "Visualizador de preguntas",
        "url": "/institute/:training_id/test/:test_id/questions"
    },{
        "name" : "Visualizador de respuestas",
        "url": "/institute/:training_id/test/:test_id/result"
    }, {
        "name" : "Estudiantes inscritos",
        "url" : "/admin/section/:_id/enrollments"
    }
]

let application_setting:any = {
    name: 'Educate en linea',
    description: 'Educacion gratis para todos',
    logo: 'assest/images/logo.png',
    email: 'info@educateenlinea.com'
};

let application_role:any = {
    "name" : "Administrador",
    "description" : "USUARIO ADMINISTRADOR",
    "actived" : true,
    "modules" : []
}

let person:any = {
    "email" : "info@educateenlinea.com",
    "name" : "Administrador",
    "create_date": new Date()
};

let application_user:any = {
    "user_name" : "admin",
    "password" : "63ebdc9c353b0ec1",
    "roles" : [],
    "create_date": new Date()
};

let runScript = async ()=>{
    try{
        let user = dbConfig['user'],
            pwd = dbConfig['password'],
            url =  `mongodb://${dbConfig['host']}:${dbConfig['port']}/${dbConfig['dbName']}` 
        if(user && pwd )
            mongoose.connect(url, { db: { native_parser: true }, user: user, pass: pwd})
        else
            mongoose.connect(url)
        let moduleModel = new BaseModel(ModuleSchema, 'module'),
            settingModel = new BaseModel(SettingSchema, 'setting'),
            moduleRequests: Array<any> = [],
            catalogRequests: Array<any> = [];
            
        let setting = await settingModel.save(application_setting)
        let root = join(process.cwd(), `/public/files/${setting['_id'] }`)
        fs.mkdirSync(root)
        fs.mkdirSync( root + '/account')
        fs.mkdirSync( root + '/templates')
        
        let userModel = new BaseModel(UserSchema, 'user');

        application_user['setting'] = setting._id;
        application_user = await userModel.save(application_user);
        console.log(`Users added success.`)

        application_modules.forEach( (mod:any) =>{
            mod.create_date = new Date();
            mod.setting = setting._id;
            mod.create_user = application_user._id;
            moduleRequests.push(moduleModel.save(mod))
        })
        let modules = await Promise.all(moduleRequests);

        console.log(`Modules added success.`)
        let catalogModel = new BaseModel(CatalogSchema, 'catalog');
        
        application_catalogs.forEach( (cat:any) =>{
            cat.create_date = new Date();
            cat.setting = setting._id;
            cat.create_user = application_user._id;
            catalogRequests.push(catalogModel.save(cat))
        })
        let catalogs = await Promise.all(catalogRequests);
        console.log(`Catalogs added success.`)

        let rolModel = new BaseModel(RoleSchema, 'role');
            
        application_role.setting = setting;
        application_role.modules = modules;
        application_role.create_user = application_user._id;
        application_role = await rolModel.save(application_role);
        console.log(`Profiles added success.`)
        
        let personModel = new BaseModel(PersonSchema, 'person');
            
        person.setting = setting;
        person.create_user = application_user;
        person = await personModel.save(person);
        console.log(`Profiles added success.`)

        application_user.roles = [application_role._id];
        application_user.person = person._id;
        application_user.status = catalogs[0]._id;
        let user_id:string = application_user._id.toString();
        await userModel.update(user_id, application_user );
        process.exit(0)
    }catch(error){
        console.log('Error agregando setting.', error)
        process.exit(0)
    }
}
runScript();
