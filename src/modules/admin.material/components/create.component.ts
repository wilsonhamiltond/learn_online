import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { IMaterial, MaterialModel } from '../../../models/training/material.model';
import { MaterialService, MATERIAL_TYPE_ENUM } from '../../../services/training/material.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { CatalogService } from '../../../services/security/catalog.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';
import { MediaService } from '../../../services/training/media.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, MaterialService, CatalogService, MediaService]
})
export class MaterialCreateComponent implements OnInit {
    material: IMaterial;
    types: ICatalog[] = [];
    statues: ICatalog[] = [];
    stage_id: string;
    material_type = MATERIAL_TYPE_ENUM;
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        public materialService: MaterialService,
        private catalogService: CatalogService,
        private notify: NotifyService
    ) {
    }

    ngOnInit() {
        let links: ILink[] = [{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Materiales',
            link: '/admin/material/list'
        }, {
            title: 'Creación de Material',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.catalogService.material_types(),
                    this.catalogService.general_status()
                ];
            this.stage_id = params['stage_id'];
            if (_id != '0')
                requests.push(this.materialService.get(_id, true))
            else {
                this.material = new MaterialModel();
                this.material.stage = params['stage_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.types = <ICatalog[]>responses[0].docs;
                this.statues = <ICatalog[]>responses[1].docs;
                if (_id != '0' && responses[1].result) {
                    responses[2].doc.type = responses[2].doc.type._id;
                    this.material = <IMaterial>responses[2].doc;
                }
                this.loadingService.hide();
            });
        });
    }
    
    save( ) {
        let request: any,
            material: any = Object.assign({}, this.material);

        if (!material._id)
            request = this.materialService.save(material);
        else
            request = this.materialService.update(material._id, material);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                this.router.navigate([`/admin/material/${this.stage_id}/list`]);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
