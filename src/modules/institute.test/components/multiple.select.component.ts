import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IOption } from '../../../models/training/option.model';
import { IQuestion } from '../../../models/training/question.model';
import { IQuestionResponse } from '../../../models/training/question.response.model';

@Component({
    selector: 'multiple-select',
    templateUrl: './multiple.select.component.html',
})
export class MultipleSelectComponent implements OnInit {
    selectedOptions: Array<IOption> = [];
    @Input()
    question: IQuestion;
    
    @Input()
    readonly: boolean = false;
    
    result: boolean = false;
    
    @Output()
    OnResponseChange = new EventEmitter();

    constructor() {
        
    }

    ngOnInit() { 
        if(this.readonly)
            this.totalResult();
    }
    
    removeResponse(option: IOption){
        var optionIndex = -1;
        for( var i =0; i < this.selectedOptions.length; i++){
            if( this.selectedOptions[i].label == option.label){
                optionIndex = i;
                break;
            }
        }
        if( optionIndex >=0 ){
            this.selectedOptions.splice( optionIndex, 1);
            this.OnResponseChange.next(this.selectedOptions);
        }
    }

    hasSelected( option: IOption):boolean{
        if(!this.readonly) return false;
        var result:boolean = this.question.response.options.some( ( o:IOption)=>{
            return option.label == o.label;
        });
        return result;
    }

    addResponse(e:any, option: IOption){
        if( e.checked ==false ){
            this.removeResponse(option);
        }else{
            this.selectedOptions.push(option);
            this.OnResponseChange.next(this.selectedOptions);
        }
    }
    
    totalResult(){
        this.result = true;
        this.question.response.options.forEach( (option:IOption)=>{
            if(this.question.responses.some(( res:IOption) =>{
                return res.label == option.label;
            }) ==false)
                this.result = false;
        })
    }
}