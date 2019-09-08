import { Request, Response, Express, Router } from 'express'
import { EnrollmentController } from '../../controllers/training/enrollment.controller'
import { BaseRoute } from '../base.router'

export class EnrollmentRoute extends BaseRoute{
    controller:EnrollmentController;
    constructor(app:Express){
        let enrollmentController = new EnrollmentController();
        super(app, enrollmentController )
        this.controller = enrollmentController;
        let route = Router();
        route.post( '/api/v1/enrollment/complete', (req: Request, res:Response) =>{
            this.controller.complete(req, res)
        })
        route.get( '/api/v1/enrollment/training/history', (req: Request, res:Response) =>{
            this.controller.history(req, res)
        })
        route.post( '/api/v1/enrollment/download', (req: Request, res:Response) =>{
            this.controller.download(req, res)
        })
        app.use(route)
    }
}