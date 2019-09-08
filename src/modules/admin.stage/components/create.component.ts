import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IStage, StageModel } from '../../../models/training/stage.model';
import { StageService } from '../../../services/training/stage.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { SectionService } from '../../../services/training/section.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { ISection } from '../../../models/training/section.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, StageService, CatalogService, SectionService]
})
export class StageCreateComponent implements OnInit {
    stage: IStage;
    sections: ISection[] = [];
    statues: ICatalog[] = [];
    section_id: string;
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private stageService: StageService,
        private sectionService: SectionService,
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
            link: '/admin/stage/list'
        }, {
            title: 'Creación de modulo',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.sectionService.select({}, 'code'),
                    this.catalogService.stage_status()
                ];
            this.section_id = params['section_id'];
            if (_id != '0')
                requests.push(this.stageService.get(_id))
            else {
                this.stage = new StageModel();
                this.stage.section = params['section_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.sections = <ISection[]>responses[0].docs;
                this.statues = <ICatalog[]>responses[1].docs;
                if (_id != '0' && responses[1].result) {
                    this.stage = <IStage>responses[2].doc;
                    this.stage.section = params['section_id'];
                }
                this.loadingService.hide();
            });
        });
    }

    save() {
        let request: any,
            stage: any = Object.assign({}, this.stage);

        this.loadingService.show('Guardando...');
        if (!stage._id)
            request = this.stageService.save(stage);
        else
            request = this.stageService.update(stage._id, stage);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                if (this.section_id)
                    this.router.navigate([`/admin/stage/${this.section_id}/list`]);
                else
                    this.router.navigate(['/admin/stage/list']);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
