import { BaseController } from '../base.controller'
import { TrainingModel } from '../../models/training/training.model';

import { Response, Request} from 'express'

export class TrainingController extends BaseController{
    model: TrainingModel;
    constructor(){
        let model = new TrainingModel();
        super(model)
        this.model = model;
        this.document_name = 'training'
    }
    
    async populars( req: Request, res:Response){
        try{
            let query = req.params.query,
                trainings = await this.model.populars( query ),
                result:any = {
                    result: true,
                    docs: trainings
                };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }

    async portal( req: Request, res:Response){
        try{
            let stage_id:string = req.params.stage_id,
                media_id:string = req.params.media_id;

            await this.model.portal(stage_id, media_id);
            let result:any = {
                    result: true,
                    message: 'Agregado como portada correctamente.'
                };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }
    
    async details( req: Request, res:Response){
        try{
            let _id:string = req.params._id,
                person_id:string;
            if(req['session'].user)
                person_id = req['session'].user.person._id;

            let training = await this.model.detials(_id, person_id);
            let result:any = {
                result: true,
                doc: training
            };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }

    async subscribed( req: Request, res:Response){
        try{
            let _id:string = req.params._id,
                person_id:string = req['session'].user.person._id;

            let subscribed = await this.model.subscribed(_id, person_id);
            let result:any = {
                result: true,
                subscribed: subscribed
            };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }
}