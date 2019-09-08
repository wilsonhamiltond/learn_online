
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../services/utils/loading.service';
import { GetUser } from '../../../services/security/user.service';
import { TestService } from '../../../services/training/test.service';
import { ITest } from '../../../models/training/test.model';
import { IResponse } from '../../../models/utils/response.model';
import { IQuestion } from '../../../models/training/question.model';
import { IQuestionResponse } from '../../../models/training/question.response.model';
import { setTestChangeObservable, setChangeURLObservable } from '../../../services/utils/utils.service';
import { QuestionService } from '../../../services/training/question.service';
import { forkJoin } from 'rxjs';
import { QuestionResponseService } from '../../../services/training/question.response.service';
import { IOption } from '../../../models/training/option.model';
import { TrainingService } from 'src/services/training/training.service';

@Component({
    selector: 'test-show',
    styles: [`
        div.height{
            height: 100%;
        }
        button.primary.green{
            background-color: #1abc9c;
            color:white;
        }
        button.primary.info{
            background-color: #20687c;
            color:white;
        }
    `],
    templateUrl: './show.componenet.html',
    providers: [LoadingService, TestService,TrainingService, QuestionService, QuestionResponseService]
})
export class TestShowComponent implements OnInit {
    test: ITest;
    firstQuestion: string;
    totalValue: number = 0;
    totalquestion: number = 0;

    constructor(
        private loadingService: LoadingService,
        private testService: TestService,
        private activatedRoute: ActivatedRoute,
        private questionService: QuestionService,
        private questionResponseService: QuestionResponseService,
        private trainingService: TrainingService
    ) {
        this.activatedRoute.params.subscribe((params) => {
            let test_id = params['test_id'],
                user = GetUser(),
                training = this.trainingService.getTraining(),
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
                    this.test.questions = <IQuestion[]>responses[1].docs;
                    this.test.responses = <IQuestionResponse[]>responses[2].docs;
                    if (this.test.questions.length == this.test.responses.length)
                        this.test.completed = true;
                    this.firstQuestion = this.test.questions[0]._id;
                    setTestChangeObservable.next(this.test);
                    this.totalResult();
                } else {
                    console.log('Test no found');
                }
            })
        });
    }

    ngOnInit() {
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

    gotToUrl(url: any) {
        setChangeURLObservable.next(`test/${this.test._id}/${url}`)
    }

    totalResult() {
        this.totalValue = 0;
        this.totalquestion = 0;
        this.test.questions.forEach((question: IQuestion) => {
            let result: boolean = true;
            for (let c = 0; c < this.test.responses.length; c++) {
                let response: any = this.test.responses[c];
                if (response.question == question._id) {
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
            if (result){
                this.totalValue += question.value;
                this.totalquestion ++;
            }
        });
    }
}