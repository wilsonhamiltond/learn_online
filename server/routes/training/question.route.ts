import { Request, Response, Express, Router } from 'express'
import { BaseRoute } from '../base.router'
import { QuestionController } from '../../controllers/training/question.controller';
import { Utils } from '../../utils/utils';

export class QuestionRoute extends BaseRoute{
    controller:QuestionController;
    constructor(app:Express){
        let trainingController = new QuestionController();
        super(app, trainingController )
        this.controller = trainingController;
        let route = Router();
        route.get( '/api/v1/question/:test_id/:enrollment_id/next', (req: Request, res:Response) =>{
            if(Utils.keepAlive(req, res))
                this.controller.next(req, res)
        })
        app.use(route)
    }
}