
import { BaseModel } from '../base.model';
import { QuestionSchema } from '../../schemas/training/question.schema';
import { QuestionResponseSchema } from '../../schemas/training/question.response.schema';
import { EnrollmentSchema } from '../../../server/schemas/training/enrollment.schema';
import { IEnrollment } from '../../../src/models/training/enrollment.model';
import { ENROLLMENT_STATUS_ENUM } from '../../../src/services/training/enrollment.service';

export class QuestionModel extends BaseModel{
    constructor( ){
        super(QuestionSchema, 'question');
    }
    
    async next( test_id:string, person_id: string, enrollment_id: string ){
        try{
            let responseModel = new BaseModel(QuestionResponseSchema, 'questionresponse'),
                responses = await responseModel.filter({
                    test: test_id,
                    enrollment: enrollment_id,
                    person: person_id
                },{
                    question: 1,
                    restant_time: 1
                }),
                question_ids = responses.map( (res:any) =>{
                    return res.question;
                }),
                questions = await this.filter({
                    test: test_id,
                    _id: { $nin: question_ids}
                },{
                    _id: 1
                });
            if(questions.length <= 0)
                return null
            let time: number;
            if(responses.length > 0)
                time = responses[responses.length - 1].restant_time;
            let question = await this.get(questions[0]._id, true);
            question.restant_time = time;
            return question;
        }catch(error){
            console.log(error)
            return `Error buscando nueva pregunta.`
        }
    }
}