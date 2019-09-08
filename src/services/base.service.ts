import { Http } from '@angular/http';
import { requestOptions, logoffTrigger } from './utils/utils.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

export var progressTrigger: any;
export var OnProgress = new Observable((observer:any) => {
    progressTrigger = observer
});

export class BaseService{
    public http: Http;
    public document_name:string;
    public base_url:string = '';
    
    private progress: number = 0;
    constructor( http:Http, document_name:string ){
        this.http = http;
        this.document_name = document_name;
        this.base_url =`api/v1/${document_name}`;
    }
    
    list(){
        return this.request('get', this.base_url);
    }
    
    get(_id:string, populate?:boolean){
        if(populate)
            return this.request('get', `${this.base_url}/${_id}/populate`);
        else
            return this.request('get', `${this.base_url}/${_id}`);
    }
    save(_object:any){
        return this.request('post', this.base_url, _object);
    }
    update(_id:string, _object: any){
        return this.request('put', `${this.base_url}/${_id}`, _object);
    }
    delete(_id:string){
        return this.request('delete', `${this.base_url}/${_id}`);
    }
    
    filter(params:any){
        return this.request('post', `${this.base_url}/filter`, params);
    }

    select(params?:any, prop?:string){
        params = params || {};
        params.fields = {
            name: 1
        };
        if(prop)
            params.fields[prop] = 1;
        return this.request('post', `${this.base_url}/filter`, params);
    }

    unauthorizad_filter(params:any){
        return this.request('post', `${this.base_url}/unauthorizad_filter`, params);
    }
    unauthorizad_size(params:any){
        return this.request('post', `${this.base_url}/unauthorizad_size`, params);
    }
    
    size(params:any){
        return this.request('post', `${this.base_url}/size`, params);
    }
    aggregate(params:any){
        return this.request('post', `${this.base_url}/aggregate`, params);
    }
    request(method:string, url:string, _object?:any){
        let requestTrigger:any;
        let request:Observable<any> = new Observable<any>( observable =>{
            requestTrigger = observable
        })
        let httpRequest;
        if(_object)
            httpRequest = this.http[method]( url, _object, requestOptions)
        else
            httpRequest = this.http[method]( url, requestOptions)

        httpRequest.pipe(map((res:any)=> res.json() )).subscribe(
            (resopnse:any)=>{
                requestTrigger.next(resopnse);
                requestTrigger.complete()
            }, 
            (error:any)=>{
                switch(error.status){
                    case 401:
                    logoffTrigger.next(error._body)
                    break;
                    default:
                    break;
                }
            })
        return request;
    } 
    
    upload (file: File): Observable<any> {
        return new Observable((observable) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();
            formData.append( this.document_name, file, file.name);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let response:any =JSON.parse( xhr.response );
                        observable.next( response );
                    } else {
                        observable.next({
                            result: false,
                            message: 'Error uploading file'
                        });
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);
                progressTrigger.next(this.progress);
            };

            xhr.open('POST', `${window.location.protocol}//${window.location.host}/api/v1/${this.document_name}/upload`, true);
            xhr.send(formData);
        });
    }
    
    
    send_mail(message:any){
        return this.request('post', `${this.base_url}/send_mail`, message);
    }
}