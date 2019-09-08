import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'error',
    templateUrl: './error.component.html'
})
export class ErrorComponent{
    message: string = '';

    constructor(
        private activatedRoute: ActivatedRoute
    ){
        this.activatedRoute.params.subscribe( (params) =>{
            this.message = params['message'];
        });
    }
    
}