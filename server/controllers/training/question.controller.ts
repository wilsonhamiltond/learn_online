import { BaseController } from '../base.controller'

import { Response, Request} from 'express'
import { QuestionModel } from '../../models/training/question.model';

export class QuestionController extends BaseController{
    model: QuestionModel;
    constructor(){
        let model = new QuestionModel();
        super(model)
        this.model = model;
        this.document_name = 'question'
    }

    async next( req: Request, res:Response){
        try{
            let test_id: string = req.params.test_id,
                enrollment_id: string = req.params.enrollment_id,
                person_id = req['session'].user.person._id,
                question = await this.model.next(test_id, person_id, enrollment_id),
                result:any = {
                    result: true,
                    doc: question
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