import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'success',
    templateUrl: './success.component.html'
})
export class SuccessComponent{
    message: string = '';
    constructor(
        private activatedRoute: ActivatedRoute
    ){
        this.activatedRoute.params.subscribe( (params) =>{
            this.message = params['message'];
        });
    }
}