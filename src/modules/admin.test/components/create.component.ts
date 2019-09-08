import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { ITest, TestModel } from '../../../models/training/test.model';
import { TestService } from '../../../services/training/test.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { StageService } from '../../../services/training/stage.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { IStage } from '../../../models/training/stage.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, TestService, CatalogService, StageService]
})
export class TestCreateComponent implements OnInit {
    test: ITest;
    statues: ICatalog[] = [];
    stage_id: string;
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private testService: TestService,
        private stageService: StageService,
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
            link: '/admin/test/list'
        }, {
            title: 'Creación de modulo',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.catalogService.general_status()
                ];
            this.stage_id = params['stage_id'];
            if (_id != '0')
                requests.push(this.testService.get(_id))
            else {
                this.test = new TestModel();
                this.test.stage = params['stage_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.statues = <ICatalog[]>responses[0].docs;
                if (_id != '0' && responses[1].result) {
                    this.test = <ITest>responses[1].doc;
                    this.test.stage = params['stage_id'];
                }
                this.loadingService.hide();
            });
        });
    }

    save() {
        let request: any,
            test: any = Object.assign({}, this.test);

        this.loadingService.show('Guardando...');
        if (!test._id)
            request = this.testService.save(test);
        else
            request = this.testService.update(test._id, test);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                if (this.stage_id)
                    this.router.navigate([`/admin/test/${this.stage_id}/list`]);
                else
                    this.router.navigate(['/admin/test/list']);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
