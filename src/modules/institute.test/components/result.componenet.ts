
import { Component, OnInit, NgZone } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../services/utils/loading.service';
import { GetUser } from '../../../services/security/user.service';

import { SELECT_ONE_OPTION, SELECT_MULTIPLE_OPTION, setChangeURLObservable, setTestChangeObservable } from '../../../services/utils/utils.service';
import { TestService } from '../../../services/training/test.service';
import { ITest } from '../../../models/training/test.model';
import { IQuestion } from '../../../models/training/question.model';
import { QuestionService } from '../../../services/training/question.service';
import { QuestionResponseService } from '../../../services/training/question.response.service';
import { forkJoin } from 'rxjs';
import { IResponse } from '../../../models/utils/response.model';
import { IQuestionResponse } from '../../../models/training/question.response.model';
import { TrainingService } from 'src/services/training/training.service';

@Component({
    selector: 'test-result',
    styles: [`
        div.height{
            height: 100%;
        }
        button.primary.green{
            background-color: #1abc9c;
            color:white;
        }
        mat-card.question, mat-card.question mat-card-subtitle, mat-card.question mat-card-content{
            background: white;
            color: #424242;
        }
    `],
    templateUrl: './result.componenet.html',
    providers: [LoadingService, TestService, TrainingService, QuestionService, QuestionResponseService]
})
export class TestResultComponent implements OnInit {
    test: ITest;

    SELECT_ONE_OPTION: string = SELECT_ONE_OPTION;
    SELECT_MULTIPLE_OPTION: string = SELECT_MULTIPLE_OPTION;

    constructor(
        private loadingService: LoadingService,
        private testService: TestService,
        private questionService: QuestionService,
        private questionResponseService: QuestionResponseService,
        private activatedRoute: ActivatedRoute,
        private trainingService: TrainingService
    ) { }

    ngOnInit() {

        this.activatedRoute.params.subscribe((params) => {
            let test_id = params['test_id'],
                training = this.trainingService.getTraining(),
                user = GetUser(),
                requests = [
                    this.testService.details(test_id),
                    this.questionService.filter({
                        params: {
                            test: test_id
                        }
                    }),
                    this.questionResponseService.filter({
                        params: {
                            test: test_id,
                            enrollment: training.section['enrollment'],
                            person: user.person._id
                        }
                    })
                ];

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.loadingService.hide();
                if (responses[0].result == true) {
                    this.test = <ITest>responses[0].docs[0];
                    this.test.responses = <IQuestionResponse[]>responses[2].docs;
                    this.test.questions = <IQuestion[]>responses[1].docs.map( (question:IQuestion) =>{
                        this.test.responses.forEach((response:any) =>{
                            if(response.question == question._id)
                                question.response = response;
                        })
                        return question;
                    });
                } else {
                    console.log('Test no found');
                }
            })
        });
    }

    testValue(): number {
        var value: number = 0;
        this.test.questions.forEach((question: IQuestion) => {
            value += question.value;
        });
        return value;
    }

    questionCount(): number {
        return this.test.questions.length;
    }

    exitTest() {
        setChangeURLObservable.next(`test/${this.test._id}/show`)
    }
}