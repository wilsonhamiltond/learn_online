import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export var showLoadingTrigger: any;
export const ShowLoginChange: Observable<any> = new Observable( (observable: any) =>{
    showLoadingTrigger = observable;
});

export var hideLoadingTrigger: any;
export const HideLoginChange: Observable<any> = new Observable( (observable: any) =>{
    hideLoadingTrigger = observable;
});

@Injectable()
export class LoadingService{
    constructor( ){}

    show( message: string){
        showLoadingTrigger.next(message);
    }

    hide( ){
        hideLoadingTrigger.next( );
    }

}