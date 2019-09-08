import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { ITraining, TrainingModel } from '../../../models/training/training.model';
import { TrainingService } from '../../../services/training/training.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';
import { PersonService } from '../../../services/security/person.service';
import { CatalogService } from '../../../services/security/catalog.service';
import { CategoryService } from '../../../services/training/category.service';
import { ICatalog } from '../../../models/security/catalog.model';
import { IPerson } from '../../../models/security/person.model';
import { ICategory } from '../../../models/training/category.model';
import { MatChipInputEvent } from '@angular/material';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, TrainingService, PersonService, CatalogService, CategoryService]
})
export class TrainingCreateComponent implements OnInit {
    training: ITraining;
    categories: ICategory[] = [];
    languages: ICatalog[] = [];
    statues: ICatalog[] = [];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private trainingService: TrainingService,
        private notify: NotifyService,
        private catalogService: CatalogService,
        private categoryService: CategoryService
    ) { }

    ngOnInit() {
        this.utilsService.setLinks([{
            title: 'Administración',
            link: '/admin/home'
        }, {
            title: 'Cursos',
            link: '/admin/training/list'
        }, {
            title: 'Creación de curso',
            active: true
        }
        ]);
        this.activatedRoute.params.subscribe((params) => {
            let _id = params['_id'],
                requests = [
                    this.categoryService.select(),
                    this.catalogService.training_status(),
                    this.catalogService.languages()
                ]
            if (_id != '0')
                requests.push(this.trainingService.get(_id))
            else
                this.training = new TrainingModel();

            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe((responses: IResponse[]) => {
                this.categories = <ICategory[]>responses[0].docs;
                this.statues = <ICatalog[]>responses[1].docs;
                this.languages = <ICatalog[]>responses[2].docs;
                if (_id != '0' && responses[3].result) {
                    this.training = <ITraining>responses[3].doc;
                }
                this.loadingService.hide();
            });
        });
    }

    display(prop: string, val: any) {
        if (!val)
            return '';
        return val[prop];
    }

    select_parent(event: any) {
        if (!event.isUserInput)
            return;
        this.training.category = event.source.value;
    }

    save() {
        let request: any,
            training: any = Object.assign({}, this.training);

        this.loadingService.show('Guardando...');
        if (!training._id)
            request = this.trainingService.save(training);
        else
            request = this.trainingService.update(training._id, training);

        request.subscribe((response: IResponse) => {
            this.loadingService.hide();
            if (response.result == true) {
                this.notify.success(response.message);
                this.router.navigate(['/admin/training/list']);
            } else {
                this.notify.error(response.message);
            }
        })
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.training.tags.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag: string): void {
        const index = this.training.tags.indexOf(tag);

        if (index >= 0) {
            this.training.tags.splice(index, 1);
        }
    }
}
