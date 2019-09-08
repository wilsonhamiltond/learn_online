
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';

import { SELECT_ONE_OPTION, SELECT_MULTIPLE_OPTION, setTestChangeObservable, setHiddeMenuObservable, setChangeURLObservable } from '../../../services/utils/utils.service';
import { TestService } from '../../../services/training/test.service';
import { IQuestion } from '../../../models/training/question.model';
import { ITest, TestModel } from '../../../models/training/test.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { IResponse } from '../../../models/utils/response.model';
import { forkJoin } from 'rxjs';
import { QuestionResponseModel } from '../../../models/training/question.response.model';
import { IQuestionResponse } from '../../../models/training/question.response.model';
import { QuestionService } from '../../../services/training/question.service';
import { QuestionResponseService } from '../../../services/training/question.response.service';
import { IOption } from '../../../models/training/option.model';
import { GetUser } from '../../../services/security/user.service';
import { TrainingService } from 'src/services/training/training.service';

@Component({
    selector: 'question-show',
    styles: [`
        div.question{
            background: #fff;
            border-radius: 3px;
            margin-bottom: 15px;
            border: 1px solid #d8d8d8;
            box-shadow: 2px 1px 10px 1px #d6d6d6;
        }
        div.height{
            height: 100%;
        }
    `],
    templateUrl: './question.componenet.html',
    providers: [LoadingService, TestService, QuestionService, TrainingService, QuestionResponseService]
})
export class QuestionShowComponent implements OnInit, OnDestroy {
    question: IQuestion;
    testResponse: IQuestionResponse;
    test: ITest;

    SELECT_ONE_OPTION:string = SELECT_ONE_OPTION;
    SELECT_MULTIPLE_OPTION:string = SELECT_MULTIPLE_OPTION;
    question_number:number = 0;
    timer: number = 0;
    secounds:number = 0;
    timerInterval: any = undefined;
    constructor(
        private loadingService: LoadingService,
        private testService: TestService,
        private activatedRoute: ActivatedRoute,
        private questionService: QuestionService,
        private questionResponse: QuestionResponseService,
        private notify: NotifyService,
        private trainingService: TrainingService
    ) {
        this.testResponse = new QuestionResponseModel();
        this.test = new TestModel();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe( ( params) =>{
            this.test._id = params['test_id'];
            let training = this.trainingService.getTraining();
            this.loadingService.show( 'Cargando...');
            var requests = [
                this.testService.details(this.test._id),
                this.questionService.next(this.test._id, training.section['enrollment']),
                this.questionService.filter({
                    params: {
                        test: this.test._id
                    },
                    fields: {
                        _id: 1
                    }
                })
            ];
            forkJoin( requests).subscribe( (responses: Array<IResponse>) =>{
                this.loadingService.hide();
                if( responses[0].result == true){
                    this.test = <ITest>responses[0].docs[0];
                    this.test.questions = <IQuestion[]>responses[2].docs;
                    setTestChangeObservable.next(this.test);
                    this.timer = (this.test.time - 1);
                    this.secounds = 60;
                    setHiddeMenuObservable.next();
                }
                
                this.next(responses[1])
            })
        });
    }

    saveResponse(){
        this.loadingService.show( 'Cargando...');
        let response:any = Object.assign({}, this.testResponse),
            user = GetUser();
        response.test = this.question.test;
        response.question = this.question._id;
        response.person = user.person._id;
        response.enrollment = this.trainingService.getTraining().section['enrollment'];
        response.restant_time = (this.timer * 60) + this.secounds;
        this.questionResponse.save(response).subscribe( (response:IResponse)=>{
            if( response.result == true){
                this.notify.success(response.message, 'RESPUESTA')
                delete this.question;
                this.nextQuestion()
            }else{
                this.notify.error(response.message, 'ERROR')
            }
        })
    }

    nextQuestion(){
        this.loadingService.show( 'Cargando...');
        this.questionService.next(this.test._id, this.trainingService.getTraining().section['enrollment'])
        .subscribe( (response:IResponse) =>{
            this.loadingService.hide();
            this.next(response)
        } )
    }

    next(response:any){
        if( response.result == true){
            this.question = <IQuestion>response.doc;
            if(this.question == null){
                this.notify.success('Examen completado correctamente.', 'AVISO')
                setChangeURLObservable.next(`test/${this.test._id}/result`)
                return;
            }
            
            let question_ids = this.test.questions.map((q:IQuestion) =>{
                    return q._id;
                });
            if(this.question.restant_time){
                this.timer = Math.floor(this.question.restant_time / 60);
                this.secounds = this.question.restant_time - ( this.timer * 60);
            }
            if(!this.timerInterval)
                 this.start_count()

            this.testResponse = new QuestionResponseModel();
            this.question_number = question_ids.indexOf(this.question._id) + 1;

        }else{
            this.notify.info(response.message, 'AVISO')
            setChangeURLObservable.next(`test/${this.test._id}/show`)
        }
    }

    responseChange(options:IOption[]){
        this.testResponse.options = options;
    }
    
    start_count(){
        this.timerInterval = setInterval(() =>{
            if( this.secounds <= 0){
                this.secounds = 60;
                this.timer--;
            }
            this.secounds--;
        },1000)
    }

    ngOnDestroy(){
        clearInterval(this.timerInterval);
    }
    
}