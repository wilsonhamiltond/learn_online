import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IPractice, PracticeModel } from '../../../models/training/practice.model';
import { PracticeService } from '../../../services/training/practice.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../../services/security/catalog.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';
import { MediaService } from '../../../services/training/media.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, PracticeService, CatalogService, MediaService]
})
export class PracticeCreateComponent implements OnInit {
    practice: IPractice;
    types: ICatalog[] = [];
    statues: ICatalog[] = [];
    stage_id: string;
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        public practiceService: PracticeService,
        private catalogService: CatalogService,
        private notify: NotifyService
    ) {
    }

    ngOnInit() {
        let links: ILink[] = [{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Practicas',
            link: '/admin/practice/list'
        }, {
            title: 'Creación de practica',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.catalogService.general_status()
                ];
            this.stage_id = params['stage_id'];
            if (_id != '0')
                requests.push(this.practiceService.get(_id, true))
            else {
                this.practice = new PracticeModel();
                this.practice.stage = params['stage_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.statues = <ICatalog[]>responses[0].docs;
                if (_id != '0' && responses[1].result) {
                    this.practice = <IPractice>responses[1].doc;
                }
                this.loadingService.hide();
            });
        });
    }
    
    save( ) {
        let request: any,
            practice: any = Object.assign({}, this.practice);

        if (!practice._id)
            request = this.practiceService.save(practice);
        else
            request = this.practiceService.update(practice._id, practice);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                this.router.navigate([`/admin/practice/${this.stage_id}/list`]);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
