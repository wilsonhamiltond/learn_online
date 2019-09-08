import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { ISection, SectionModel } from '../../../models/training/section.model';
import { SectionService } from '../../../services/training/section.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { TrainingService } from '../../../services/training/training.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { ITraining } from '../../../models/training/training.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { ILink } from '../../../models/utils/link.model';
import { IPerson } from '../../../models/security/person.model';
import { PersonService } from '../../../services/security/person.service';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, SectionService, CatalogService, TrainingService, PersonService]
})
export class SectionCreateComponent implements OnInit {
    section: ISection;
    trainings: ITraining[] = [];
    statues: ICatalog[] = [];
    training_id: string;
    
    persons: IPerson[] = [];
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private sectionService: SectionService,
        private trainingService: TrainingService,
        private catalogService: CatalogService,
        private personService: PersonService,
        private notify: NotifyService
    ) {
    }

    ngOnInit() {
        let links: ILink[] = [{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Secciones',
            link: '/admin/section/list'
        }, {
            title: 'Creación de sección',
            active: true
        }];
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.trainingService.select({}, 'title'),
                    this.catalogService.section_status(),
                    this.personService.select(),
                ]
            if (params['training_id']) {
                links[1].link = links[1].link.replace('section', `section/${params['training_id']}`)
                links.splice(1, 0, {
                    title: 'Cursos',
                    link: '/admin/training/list'
                })
                this.training_id = params['training_id'];
            }
            if (_id != '0')
                requests.push(this.sectionService.get(_id))
            else {
                this.section = new SectionModel();
                this.section.training = params['training_id'];
            }
            
            this.utilsService.setLinks(links);

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.trainings = <ITraining[]>responses[0].docs;
                this.statues = <ICatalog[]>responses[1].docs;
                this.persons = <IPerson[]>responses[2].docs;
                if (_id != '0' && responses[3].result) {
                    this.section = <ISection>responses[3].doc;
                }
                this.loadingService.hide();
            });
        });
    }

    save() {
        let request: any,
            section: any = Object.assign({}, this.section);

        this.loadingService.show('Guardando...');
        if (!section._id)
            request = this.sectionService.save(section);
        else
            request = this.sectionService.update(section._id, section);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                if (this.training_id)
                    this.router.navigate([`/admin/section/${this.training_id}/list`]);
                else
                    this.router.navigate(['/admin/section/list']);
            } else {
                this.notify.error(response.message);
            }
        })
    }
}
