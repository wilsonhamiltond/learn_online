import * as express from 'express'
import { Request, Response } from 'express'
import { json, urlencoded } from 'body-parser'
import * as config from 'config'
import * as mongoose from 'mongoose'
import { join } from 'path'
let session = require('express-session')
/**
 * SCHEMAS
 */
import { ModuleSchema } from './schemas/security/module.schema'
import { RoleController } from './controllers/security/role.controller'
/**
 * ROUTES
 */
import { BaseRoute } from './routes/base.router'
import { UserRoute } from './routes/security/user.route'

import { BaseController } from './controllers/base.controller'

declare let process:any

import { Utils } from './utils/utils'
import { PersonSchema } from './schemas/security/person.schema';
import { MediaSchema } from './schemas/training/media.schema';
import { TestSchema } from './schemas/training/test.schema';
import { SectionSchema } from './schemas/training/section.schema';
import { CategorySchema } from './schemas/training/category.schema';
import { TestResponseSchema } from './schemas/training/test.response.schema';
import { MaterialViewSchema } from './schemas/training/material.view.schema';
import { CatalogSchema } from './schemas/security/catalog.schema';
import { ContactSchema } from './schemas/security/contact.schema';
import { StageSchema } from './schemas/training/stage.schema';
import { MaterialController } from './controllers/training/material.controller';
import { TrainingRoute } from './routes/training/training.route';
import { EnrollmentRoute } from './routes/training/enrollment.route';
import { QuestionResponseSchema } from './schemas/training/question.response.schema';
import { QuestionRoute } from './routes/training/question.route';
import { SettingRoute } from './schemas/administration/setting.route';
import { PracticeSchema } from './schemas/training/practice.schema';
import { PracticeResponseSchema } from './schemas/training/practice.reponse.schema';
import { ForumSchema } from './schemas/training/forum.schema';
import { MessageSchema } from './schemas/training/message.schema';

class AppServer{
    public app: any;
    private dbConfig:object;
    private sessionConfig:object;
    private port:number;
    private max_file_size: string;
    
    constructor(){
        this.dbConfig = config.get("dbConfig")
        this.sessionConfig = config.get("sessionConfig")
        this.port = <number>config.get("port")
        
        this.max_file_size = <string>config.get('max_file_size') || '2mb'
        this.app = express()
        this.config()
        this.services()
    }
    
    config(){
        this.app.use( session(this.sessionConfig) )

        let path = process.cwd()
        this.app.use(json({ limit: this.max_file_size }))
        this.app.use(urlencoded({limit:  this.max_file_size, extended: true}));
        this.app.use( express.static( join( path, '/public' ) ) )
        this.app.use( express.static( path ) )
        this.app.use( express.static( join( path, '/dist' ) ) )
        this.app.use( express.static( join( path, '/node_modules' ) ) )
        let user = this.dbConfig['user'],
            pwd = this.dbConfig['password'],
            url =  `mongodb://${this.dbConfig['host']}:${this.dbConfig['port']}/${this.dbConfig['dbName']}` 
        if(user && pwd )
            mongoose.connect(url, { db: { native_parser: true }, user: user, pass: pwd})
        else
            mongoose.connect(url)
        
    }
    
    services(){
        new UserRoute(this.app)
        new TrainingRoute(this.app)
        new EnrollmentRoute(this.app)
        new QuestionRoute(this.app)
        new BaseRoute(this.app, new RoleController())
        new BaseRoute(this.app, new MaterialController())
        
        new SettingRoute(this.app)
        
        new BaseRoute(this.app, new BaseController(null, 'person', PersonSchema, {
            upload_name: 'avatar_url'
        } ))
        new BaseRoute(this.app, new BaseController(null, 'module', ModuleSchema ))
        
        new BaseRoute(this.app, new BaseController(null, 'category', CategorySchema ))
        new BaseRoute(this.app, new BaseController(null, 'stage', StageSchema ))
        new BaseRoute(this.app, new BaseController(null, 'section', SectionSchema ))
        new BaseRoute(this.app, new BaseController(null, 'test', TestSchema ))
        new BaseRoute(this.app, new BaseController(null, 'testresponse', TestResponseSchema ))
        new BaseRoute(this.app, new BaseController(null, 'questionresponse', QuestionResponseSchema ))
        new BaseRoute(this.app, new BaseController(null, 'materialview', MaterialViewSchema ))
        new BaseRoute(this.app, new BaseController(null, 'media', MediaSchema ))
        new BaseRoute(this.app, new BaseController(null, 'catalog', CatalogSchema ))
        new BaseRoute(this.app, new BaseController(null, 'contact', ContactSchema ))
        
        new BaseRoute(this.app, new BaseController(null, 'practice', PracticeSchema, {
            upload_name: 'attacemnt'
        } ))
        new BaseRoute(this.app, new BaseController(null, 'practiceresponse', PracticeResponseSchema, {
            upload_name: 'attacemnt'
        } ))
        
        new BaseRoute(this.app, new BaseController(null, 'forum', ForumSchema ))
        new BaseRoute(this.app, new BaseController(null, 'message', MessageSchema ))

        this.app.get('/', ( res:Response)=>{
            let path = `${process.cwd()}/dist/index.html`
           res.sendFile( path )
        });

        this.app.get('/api/v1/session/keepalive', (req:Request, res:Response)=>{
            if( Utils.keepAlive(req, res) )
                res.json({
                    result: true
                })
        });
    }

    run(): any{
        let server =  this.app.listen(this.port, () =>{
           console.log(`Server running in port: ${this.port}`)
        });
        return server;
    }
    public static bootstrap(){
       return new AppServer().run();
    }
}

export const app = AppServer.bootstrap()