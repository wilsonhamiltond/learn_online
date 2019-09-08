import { Request, Response, Express, Router } from 'express'
import { BaseController } from '../controllers/base.controller'
import { Schema } from 'mongoose'
import { BaseModel } from '../models/base.model';
import { Utils } from '../utils/utils'
let multer = require('multer')
import { join } from 'path'
export class BaseRoute{
    public controller: BaseController

    constructor(app:Express, controller:BaseController ){
        this.controller = controller

        let route = Router();
        route.get( `/api/v1/${this.controller.document_name}`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.list(req, res)
        })
        route.get( `/api/v1/${this.controller.document_name}/:_id`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.get(req, res)
        })
        route.get( `/api/v1/${this.controller.document_name}/:_id/populate`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.get(req, res, true)
        })
        route.post( `/api/v1/${this.controller.document_name}`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.save(req, res)
        })
        route.put( `/api/v1/${this.controller.document_name}/:_id`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.update(req, res)
        })
        route.delete( `/api/v1/${this.controller.document_name}/:_id`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.delete(req, res)
        })

        /**
         * Advance services
         */
        route.post( `/api/v1/${this.controller.document_name}/size`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.size(req, res)
        })
        route.post( `/api/v1/${this.controller.document_name}/filter`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.filter(req, res)
        })
        route.post( `/api/v1/${this.controller.document_name}/aggregate`, (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller.aggregate(req, res)
        })

        route.post(`/api/v1/${this.controller.document_name}/upload`, multer({ 
            dest: join(process.cwd(), '/public/files/temps/') 
        }).single(this.controller.document_name), function(req, res){
            let file = req['file'];
            if( Utils.keepAlive(req, res) )
                res.json({
                    file: file,
                    result: true
                });
        });
        app.use(route)
    }
}