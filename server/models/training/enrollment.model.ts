
import { BaseModel } from '../base.model';
import { EnrollmentSchema } from '../../schemas/training/enrollment.schema';
import { MailModel } from '../security/mail.model';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as config from 'config'
import { IEnrollment } from '../../../src/models/training/enrollment.model';
import { PersonSchema } from '../../schemas/security/person.schema';
import { SectionSchema } from '../../schemas/training/section.schema';
import { TrainingSchema } from '../../schemas/training/training.schema';
import { StageSchema } from '../../schemas/training/stage.schema';
import { TestSchema } from '../../schemas/training/test.schema';
import { QuestionSchema } from '../../schemas/training/question.schema';
import { QuestionResponseSchema } from '../../schemas/training/question.response.schema';
import { IQuestion } from '../../../src/models/training/question.model';
import { IOption } from '../../../src/models/training/option.model';
import { ISection } from '../../../src/models/training/section.model';
import { ENROLLMENT_STATUS_ENUM } from '../../../src/services/training/enrollment.service';
import { mongo } from 'mongoose';

var webshot = require('webshot');

export class EnrollmentModel extends BaseModel{
    constructor( ){
        super(EnrollmentSchema, 'enrollment');
    }
    
    async save( _enrollment:any){
        try{
            let enrollment:IEnrollment = await super.save(_enrollment),
                personModel = new BaseModel(PersonSchema, 'person'),
                sectionModel = new BaseModel(SectionSchema, 'section'),
                trainingModel = new BaseModel(TrainingSchema, 'training');
            enrollment.person = await personModel.get( enrollment.person.toString() );
            enrollment.section = await sectionModel.get( enrollment.section.toString() );
            enrollment.section.training = await trainingModel.get( enrollment.section.training.toString(), true );
            
            await this.enrollment_mail(enrollment);

            return enrollment;
        }catch(error){
            console.log(error)
            return `Error inscribiendote en el curso.`
        }
    }
    
    private async enrollment_mail(enrollment:IEnrollment ){
        let mailModel = new MailModel(),
            path = join(process.cwd(), 'public', 'mails', 'enrollment.mail.html'),
            template = readFileSync(path, "utf8"),
            site_url = config.get('site_url');

        template = template.replace('{{link_url}}', site_url.toString() );
        template = template.replace('{{logo_url}}', `${site_url}/assets/images/educate-logo.png`);
        
        template = template.replace('{{training_title}}', enrollment.section.training.title);
        template = template.replace('{{training_description}}', enrollment.section.training.description);

        await mailModel.send(null, [enrollment.person.email], 
            `Bienvenido a ${enrollment.section.training.title}`, template );
    }
    
    async complete(enrollment:any ){
        try{
            let total_value:number = 0,
                response_value:number = 0,
                sectionModel = new BaseModel(SectionSchema, 'section'),
                stageModel = new BaseModel( StageSchema, 'stage'),
                testModel = new BaseModel( TestSchema, 'test'),
                questionModel = new BaseModel( QuestionSchema, 'question'),
                responseModel = new BaseModel( QuestionResponseSchema, 'questionresponse'),
                section:ISection = await sectionModel.get(enrollment.section),
                stages = await stageModel.filter({
                    section: enrollment.section
                }, {
                    _id: 1
                });
            for(let si:number = 0; si < stages.length; si++){
                let tests = await testModel.filter({
                    stage: stages[si]._id
                },{
                    _id: 1
                });
                for( let ti: number = 0; ti < tests.length; ti ++){
                    let questions = await questionModel.filter({
                            test: tests[ti]._id
                        },{
                            _id: 1,
                            responses: 1,
                            value: 1
                        }),
                        responses = await responseModel.filter({
                            test: tests[ti]._id,
                            person: enrollment.person
                        },{
                            question: 1,
                            options: 1
                        });
                    
                    questions.forEach((question: IQuestion) => {
                        total_value += question.value;
                        let result: boolean = true;
                        for (let c = 0; c < responses.length; c++) {
                            let response: any = responses[c];
                            if (response.question.toString() == question._id.toString()) {
                                response.options.forEach((option: IOption) => {
                                    if (question.responses.some((op: IOption) => {
                                        return op.label == option.label;
                                    }) == false) {
                                        result = false;
                                    }
                                })
                                break;
                            }
                        }
                        if (result)
                            response_value += question.value;
                    });
                }
            }
            let user_percentage:number = response_value * 100 / total_value;
            await this.update(enrollment._id, { 
                percentage: Number( user_percentage.toFixed(2)),
                status: ENROLLMENT_STATUS_ENUM.finished,
                end_date: new Date()
            } );
        }catch(error){
            console.log(error)
            return `Error inscribiendote en el curso.`
        }
    }
    
    async history( person_id:string){
        try{
            let enrollments:IEnrollment[] = await super.filter({
                    person: person_id
                },{
                    section: {
                        _id: 1,
                        code: 1,
                        percentage: 1,
                        training: 1,
                        author: 1
                    },
                    person: {
                        name: 1,
                        last_name: 1
                    },
                    create_date: 1,
                    end_date: 1,
                    percentage: 1,
                    status: {
                        name: 1
                    }
                }),
                trainingModel = new BaseModel(TrainingSchema, 'training'),
                personModel = new BaseModel( PersonSchema, 'person');
            
            for( let i = 0; i < enrollments.length; i++){
                let enrollment:any = enrollments[i],
                    trainings = await trainingModel.filter({
                        _id: new mongo.ObjectId( enrollment.section.training )
                    },{
                        title: 1
                    },null, 0, 1 ),
                    authors = await personModel.filter({
                        _id: new mongo.ObjectId( enrollment.section.author )
                    });
                enrollments[i].training = trainings[0];
                enrollments[i].section.author = authors[0]
            }

            return enrollments;
        }catch(error){
            console.log(error)
            return `Error inscribiendote en el curso.`
        }
    }
    
    async download(enrollment:IEnrollment ){
        try{
            return await new Promise( (resolve: any, reject: any) =>{
                let path:string = join(process.cwd(), 'templates', 'certificate.html'),
                    out_path:string = join(process.cwd(), 'public', `${enrollment._id}_certificate.png`),
                    html:string = readFileSync(path, "utf8"),
                    options = {
                        siteType:'html'
                    };
                
                html = html.replace('{{person_name}}', `${enrollment.person.name} ${enrollment.person.last_name}`);
                html = html.replace('{{enrollment_code}}', `${enrollment._id}`);
                html = html.replace('{{training_title}}', `${enrollment.training.title}`);
                html = html.replace('{{user_percentage}}', enrollment.percentage.toFixed(2));
                html = html.replace('{{finish_day}}', new Date(enrollment.end_date).getDate().toString());
                html = html.replace('{{finish_month}}', new Date(enrollment.end_date).getMonth().toString());
                html = html.replace('{{finish_year}}', new Date(enrollment.end_date).getFullYear().toString());
                html = html.replace('{{teacher_name}}', `${enrollment.section.author.name} ${enrollment.section.author.last_name}`);
                
                webshot(html, out_path, options, (err:any) => {
                    if(err)
                        reject(err)
                    resolve(out_path)
                });
            })
        }catch(error){
            console.log(error)
            return `Error inscribiendote en el curso.`
        }
    }
}