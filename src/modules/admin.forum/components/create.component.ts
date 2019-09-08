import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IForum, ForumModel } from '../../../models/training/forum.model';
import { ForumService } from '../../../services/training/forum.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../../services/security/catalog.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';
import { MediaService } from '../../../services/training/media.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, ForumService, CatalogService, MediaService]
})
export class ForumCreateComponent implements OnInit {
    forum: IForum;
    types: ICatalog[] = [];
    statues: ICatalog[] = [];
    stage_id: string;
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        public forumService: ForumService,
        private catalogService: CatalogService,
        private notify: NotifyService
    ) {
    }

    ngOnInit() {
        let links: ILink[] = [{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Foros',
            link: '/admin/forum/list'
        }, {
            title: 'Creación de foro',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.catalogService.general_status()
                ];
            this.stage_id = params['stage_id'];
            if (_id != '0')
                requests.push(this.forumService.get(_id, true))
            else {
                this.forum = new ForumModel();
                this.forum.stage = params['stage_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.statues = <ICatalog[]>responses[0].docs;
                if (_id != '0' && responses[1].result) {
                    this.forum = <IForum>responses[1].doc;
                }
                this.loadingService.hide();
            });
        });
    }
    
    save( ) {
        let request: any,
            forum: any = Object.assign({}, this.forum);

        if (!forum._id)
            request = this.forumService.save(forum);
        else
            request = this.forumService.update(forum._id, forum);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                this.router.navigate([`/admin/forum/${this.stage_id}/list`]);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
