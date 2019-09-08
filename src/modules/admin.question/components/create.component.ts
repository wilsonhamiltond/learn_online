import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService, SELECT_ONE_OPTION, SELECT_MULTIPLE_OPTION } from '../../../services/utils/utils.service';

import { IQuestion, QuestionModel } from '../../../models/training/question.model';
import { QuestionService } from '../../../services/training/question.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { TestService } from '../../../services/training/test.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { ITest } from '../../../models/training/test.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, QuestionService, CatalogService, TestService]
})
export class QuestionCreateComponent implements OnInit {
    question: IQuestion;
    types: ICatalog[] = [];
    test_id: string;
    
    SELECT_ONE_OPTION:string = SELECT_ONE_OPTION;
    SELECT_MULTIPLE_OPTION:string = SELECT_MULTIPLE_OPTION;

    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private questionService: QuestionService,
        private testService: TestService,
        private catalogService: CatalogService,
        private notify: NotifyService
    ) {
    }

    ngOnInit() {
        let links: ILink[] = [{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Secciones',
            link: '/admin/question/list'
        }, {
            title: 'Creación de modulo',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.catalogService.question_types()
                ];
            this.test_id = params['test_id'];
            if (_id != '0')
                requests.push(this.questionService.get(_id))
            else {
                this.question = new QuestionModel();
                this.question.test = params['test_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.types = <ICatalog[]>responses[0].docs;
                if (_id != '0' && responses[1].result) {
                    this.question = <IQuestion>responses[1].doc;
                    this.question.test = params['test_id'];
                }
                this.loadingService.hide();
            });
        });
    }

    optionChange(options:any){
        this.question.options = options;
    }

    responseChange(responses:any){
        this.question.responses = responses;
    }
    
    save() {
        let request: any,
            question: any = Object.assign({}, this.question);

        this.loadingService.show('Guardando...');
        if (!question._id)
            request = this.questionService.save(question);
        else
            request = this.questionService.update(question._id, question);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                if (this.test_id)
                    this.router.navigate([`/admin/question/${this.test_id}/list`]);
                else
                    this.router.navigate(['/admin/question/list']);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
