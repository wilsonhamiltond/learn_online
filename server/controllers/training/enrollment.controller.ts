import { BaseController } from '../base.controller'

import { Response, Request} from 'express'
import { EnrollmentModel } from '../../models/training/enrollment.model';
import { unlinkSync, readFileSync, createReadStream } from 'fs';

export class EnrollmentController extends BaseController{
    model: EnrollmentModel;
    constructor(){
        let model = new EnrollmentModel();
        super(model)
        this.model = model;
        this.document_name = 'enrollment'
    }

    async complete( req: Request, res:Response){
        try{
            let enrollment: any = req.body;
            
            await this.model.complete( enrollment );
            
            let result:any = {
                    result: true,
                    message: `Has finalizado el curso correctamente.`
                };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }
    
    async history( req: Request, res:Response){
        try{
            let person_id: string = req['session'].user.person._id;
            
            let enrollments = await this.model.history( person_id );
            
            let result:any = {
                result: true,
                docs: enrollments
            };
            res.json(result);
        }catch(e){
            res.json({
                result: false,
                message: e.message
            })
        }
    }

    async download( req: Request, res:Response){
        try{
            let enrollment: any = req.body;
            
            let certificate_path:any = await this.model.download( enrollment );

            let bitmap = readFileSync(certificate_path),
                url = new Buffer(bitmap).toString('base64');
            
            unlinkSync(certificate_path);
            
            let result:any = {
                result: true,
                doc: {
                    type: 'image/png',
                    url: url
                }
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