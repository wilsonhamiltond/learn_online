import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TestService } from '../../../services/training/test.service';
import { IOption } from '../../../models/training/option.model';
import { IQuestion } from '../../../models/training/question.model';
import { IQuestionResponse } from '../../../models/training/question.response.model';

@Component({
    selector: 'one-select',
    templateUrl: './one.select.component.html',
    providers: [TestService]
})
export class OneSelectComponent implements OnInit {
    selectedOptions: Array<IOption> = [];
    radioOption = 'radioOption'
    @Input()
    question: IQuestion;

    @Input()
    readonly: boolean = false;

    @Output()
    OnResponseChange = new EventEmitter();

    result: boolean = false;

    constructor( ) {}

    ngOnInit() { 
        if( this.readonly )
            this.totalResult()
    }

    hasSelected( option: IOption):boolean{
        if( !this.readonly) return false;
        var result:boolean = this.question.response.options[0].label  == option.label;
        return result;
    }
    
    addResponse( option: IOption){
        this.OnResponseChange.next([option]);
    }
    
    totalResult(){
        this.result = true;
        this.question.response.options.forEach( (option:IOption)=>{
            if(this.question.responses.some(( op:IOption ) =>{
                return op.label == option.label;
            }) == false ) {
                this.result = false;
            }
        })
    }
}