import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionResponseModel } from '../../../models/training/question.response.model';
import { QuestionService } from '../../../services/training/question.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { IOption, OptionModel } from '../../../models/training/option.model';


@Component({
    selector: 'multiple-select',
    templateUrl: './multiple.select.component.html',
    providers: [QuestionService]
})
export class MultipleSelectComponent implements OnInit {
    option: IOption;

    @Input()
    options: Array<IOption>;

    @Input()
    responses: Array<IOption>;
    
    @Output()
    OnOptionChange = new EventEmitter();

    @Output()
    OnResponseChange = new EventEmitter();

    constructor(
        private questionService: QuestionService,
        public notify: NotifyService
    ) {
        this.option = new OptionModel();
     }

    ngOnInit() { 

    }

    save(){
        var exist = this.options.some( (option: IOption)=>{
            return option.label == this.option.label;
        });
        if(exist){
            this.notify.warning('Esta opción ya existe.');
            return
        }
        this.options.push(this.option);
        this.OnOptionChange.next(this.options);
        this.option = new OptionModel();
        this.notify.success('Agregada correctamente.', 'Opción')
    }

    delete( option: IOption){
        var result = confirm('¿Desea borrar esta opción?');
        if(result){
            let optionIndex = this.options.indexOf(option);
            this.removeResponse(option);
            if(optionIndex >= 0){
                this.options.splice( optionIndex, 1);
                this.OnOptionChange.next(this.options);
            }
            this.notify.success('Borrada correctamente.', 'Opción');
        }
    }
    
    removeResponse(option: IOption){
        var responseIndex = -1;
        for( var i =0; i < this.responses.length; i++){
            if( this.responses[i].label == option.label){
                responseIndex = i;
                break;
            }
        }
        if( responseIndex >=0 ){
            this.responses.splice( responseIndex, 1);
            this.OnResponseChange.next(this.responses);
        }
    }

    hasSelected( option: IOption):boolean{
        var result:boolean = this.responses.some( (response:IOption)=>{
            return response.label == option.label;
        });
        return result;
    }

    addResponse(e:any, option: IOption){
        if( e.checked ==false ){
            this.removeResponse(option);
        }else{
            var response = new OptionModel();
            response = option;
            this.responses.push(response);
            this.OnResponseChange.next(this.responses);
        }
    }
}