import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService } from '../../../services/utils/loading.service';
import { UtilsService } from '../../../services/utils/utils.service';

import { ICategory, CategoryModel } from '../../../models/training/category.model';
import { CategoryService } from '../../../services/training/category.service';

import { IResponse } from '../../../models/utils/response.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { forkJoin } from 'rxjs';

@Component({
    templateUrl: './create.component.html',
    providers: [UtilsService, LoadingService, CategoryService]
})
export class CategoryCreateComponent implements OnInit{
    category: ICategory;
    categories: ICategory[] = [];
    constructor(
        private utilsService: UtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private categoryService:CategoryService,
        private notify: NotifyService
    ){
        this.category = new CategoryModel();
    }
    
    ngOnInit(){
        this.utilsService.setLinks([{
                title: 'Administración',
                link: '/admin/home'
            },{
                title: 'Categoria',
                link: '/admin/category/list'
            },{
                title: 'Creación de categoria',
                active: true
            }
        ]);
        this.activatedRoute.params.subscribe( (params) =>{
            let _id = params['_id'],
                requests = [
                    this.categoryService.filter({
                        fields: {
                            name: true
                        }
                    })
                ]
            if( _id != '0')
                requests.push(this.categoryService.get(_id, true))
                
            this.loadingService.show('Cargando...');
            forkJoin(requests).subscribe( (responses: IResponse[]) =>{
                this.categories = <ICategory[]>responses[0].docs;
                if( _id != '0' && responses[1].result){
                    this.category = <ICategory>responses[1].doc;
                    if(this.category.parent_category){
                        let category = new CategoryModel();
                        category._id = this.category.parent_category._id;
                        category.name = this.category.parent_category.name;
                        this.category.parent_category = category;
                    }
                }
                this.loadingService.hide();
            });
        });
    }

    display(prop:string, val:any){
        if(!val)
            return '';
        return val[prop];
    }

    select_parent(event:any){
        if (!event.isUserInput)
            return;
        this.category.parent_category = event.source.value;
    }

    save(){
        let request:any,
            category:any = Object.assign({}, this.category);

        category.parent_category = category.parent_category._id;
        this.loadingService.show('Guardando...');
        if(!category._id)
            request = this.categoryService.save(category);
        else
            request = this.categoryService.update(category._id, category);
        
        request.subscribe( (response: IResponse) =>{
            this.loadingService.hide();
            if( response.result == true){
                this.notify.success(response.message);
                this.router.navigate(['/admin/category/list']);
            }else{
                this.notify.error(response.message);
            }
        })
    }
}
