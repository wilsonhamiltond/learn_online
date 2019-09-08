import { Injectable } from '@angular/core';
import { Headers, ResponseOptions } from '@angular/http';
import { IModule, ModuleModel } from '../../models/security/module.model';
import { Observable, forkJoin } from 'rxjs'
import { share } from 'rxjs/operators';
import { ILink } from '../../models/utils/link.model';
import { hideLoadingTrigger, showLoadingTrigger } from './loading.service';

export let loginTrigger: any;
export const OnLoginChange: Observable<any> = new Observable((observable: any) => {
    loginTrigger = observable;
}).pipe(share());

export let logoffTrigger: any;
export const OnLogoffChange: Observable<any> = new Observable((observable: any) => {
    logoffTrigger = observable;
}).pipe(share());

export let titleTrigger: any;
export const OnTitleChange: Observable<any> = new Observable((observable: any) => {
    titleTrigger = observable;
}).pipe(share());

export let loadFormTrigger: any;
export const OnLoadFormChange: Observable<any> = new Observable((observable) => {
    loadFormTrigger = observable;
});

export const requestOptions: ResponseOptions = new ResponseOptions({
    headers: new Headers({
        'Content-Type': 'application/json'
    })
});

export let trainingTrigger: any;
export const OnTrainingChange: Observable<any> = new Observable((observable: any) => {
    trainingTrigger = observable;
}).pipe(share());

export function SetUserModules(m: IModule): void {
    sessionStorage.setItem('current_module', JSON.stringify(m))
}

export function GetCurrentModule(): IModule {
    let m: IModule = new ModuleModel;
    let moduleObj = sessionStorage.getItem('current_module')
    if (moduleObj) {
        m = <IModule>JSON.parse(moduleObj);
    }

    return m;
}

export var paginateFilter = (params: any, service: any) => {
    let oservable: any = new Observable<any>((trigger: any) => {
        let sizeRequest = service.size(params),
            dataRequest = service.filter(params);
        forkJoin([sizeRequest, dataRequest])
            .subscribe((responses: Array<any>) => {
                trigger.next({
                    size: responses[0].size,
                    data: responses[1].docs
                });
            });
    })
    return oservable;
}
var setLinksObserbable: any;
export const OnSetLinks: Observable<any> = new Observable((observable: any) => {
    setLinksObserbable = observable;
    return () => { }
}).pipe(share());

export const SELECT_ONE_OPTION = '5b89de263fa9de09d05b079c';
export const SELECT_MULTIPLE_OPTION = '5b89de193fa9de09d05b079b';

export var setMaterialChangeObservable: any;
export const OnMaterialChanage: Observable<any> = new Observable((observable: any) => {
    setMaterialChangeObservable = observable;
}).pipe(share());

export var setMaterialEndObservable: any;
export const OnMaterialEnd: Observable<any> = new Observable((observable: any) => {
    setMaterialEndObservable = observable;
}).pipe(share());

export var setTestChangeObservable: any;
export const OnTestChanage: Observable<any> = new Observable((observable: any) => {
    setTestChangeObservable = observable;
    return () => { }
});

export var setChangeURLObservable: any;
export const OnURLChange: Observable<any> = new Observable((observable: any) => {
    setChangeURLObservable = observable;
    return () => { }
});

export var setHiddeMenuObservable: any;
export const OnHiddeMenu: Observable<any> = new Observable((observable: any) => {
    setHiddeMenuObservable = observable;
    return () => { }
});

export const CKEDITOR_CONFIG: any = {
    removeButtons: 'Underline,Subscript,Superscript,SpecialChar,Source',
    toolbarGroups: [
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['spellchecker'] },
        { name: 'links', groups: ['links'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'others', groups: ['others'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] }
    ]
}
@Injectable()
export class UtilsService {
    constructor() { }

    setLinks(links: ILink[]): void {
        setLinksObserbable.next(links);
    }
    
    show( message?: string){
        showLoadingTrigger.next(message || '');
    }

    hide( ){
        hideLoadingTrigger.next( );
    }
}