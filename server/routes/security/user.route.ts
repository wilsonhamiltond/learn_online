import { Request, Response, Express, Router } from 'express'
import { UserController } from '../../controllers/security/user.controller'
import { BaseRoute } from '../base.router'
import { join } from 'path'
import { Utils } from '../../utils/utils'
let multer = require('multer')

export class UserRoute extends BaseRoute{
    controller:UserController;
    constructor(app:Express){
        let userController = new UserController();
        super(app, userController )
        this.controller = userController;
        let route = Router();
        route.post( '/api/v1/user/login', (req: Request, res:Response) =>{
            this.controller['login'](req, res)
        })
        route.get( '/api/v1/user/:_id/verify', (req: Request, res:Response) =>{
            this.controller.verify(req, res)
        })
        route.post( '/api/v1/user/register', (req: Request, res:Response) =>{
            this.controller.register(req, res)
        })
        route.post( '/api/v1/user/logout', (req: Request, res:Response) =>{
            this.controller['logout'](req, res)
        })
        route.post( '/api/v1/user/password', (req: Request, res:Response) =>{
            if( Utils.keepAlive(req, res) )
                this.controller['passwordChange'](req, res)
        })
        route.get( '/api/v1/user/:name/setting', (req: Request, res:Response) =>{
            this.controller['setting'](req, res)
        })
        route.get( '/api/v1/user/:user_name/check', (req: Request, res:Response) =>{
            this.controller.check(req, res)
        })
        route.post( '/api/v1/user/recover', (req: Request, res:Response) =>{
            this.controller.recover(req, res)
        })
        route.put( '/api/v1/user/:_id/password', (req: Request, res:Response) =>{
            this.controller.password(req, res)
        })
        app.use(route)
    }
}