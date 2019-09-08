import { Request, Response, Express, Router } from 'express'
import { SettingController } from '../../controllers/administration/setting.controller'
import { BaseRoute } from '../../routes/base.router';

export class SettingRoute extends BaseRoute{
    controller: SettingController;
    constructor(app:Express){
        let settingController = new SettingController()
        super(app, settingController )
        this.controller = settingController;
        let route = Router();
        
        route.get( `/api/v1/setting/get/current`, (req: Request, res:Response) =>{
            this.controller['current'](req, res)
        })
        route.post( `/api/v1/setting/contact`, (req: Request, res:Response) =>{
            this.controller.contact(req, res)
        })
        app.use(route)
    }
}