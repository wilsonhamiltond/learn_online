import { Request, Response, Express, Router } from 'express'
import { TrainingController } from '../../controllers/training/training.controller'
import { BaseRoute } from '../base.router'
import { Utils } from '../../utils/utils'

export class TrainingRoute extends BaseRoute{
    controller:TrainingController;
    constructor(app:Express){
        let trainingController = new TrainingController();
        super(app, trainingController )
        this.controller = trainingController;
        let route = Router();
        route.get( '/api/v1/training/popular/list/:query', (req: Request, res:Response) =>{
            this.controller.populars(req, res)
        })
        route.get( '/api/v1/training/popular/list', (req: Request, res:Response) =>{
            this.controller.populars(req, res)
        })

        route.get( '/api/v1/training/:stage_id/portal/:media_id', (req: Request, res:Response) =>{
            if(Utils.keepAlive(req, res))
                this.controller.portal(req, res)
        })

        route.get( '/api/v1/training/:_id/details', (req: Request, res:Response) =>{
            this.controller.details(req, res)
        })
        route.get( '/api/v1/training/:_id/subscribed', (req: Request, res:Response) =>{
            this.controller.subscribed(req, res)
        })
        app.use(route)
    }
}