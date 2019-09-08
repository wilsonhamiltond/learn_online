import { Component } from '@angular/core';

@Component({
  selector: 'loading',
  styles: [`
    div.lock-loading{
        position: absolute;
        top: 0;
        left: 0;
        min-height: 512px;
        width: 100%;
        height: 100%;
        z-index: 10000;
        background-color: white;
    }
    div.lock-loading .progress{
        left: 50%;
        top: 50%;
        position: relative;
        margin-left: -128px;
        margin-top: -80px;
        width: 256px;
        height: 160px;
        background: transparent;
    }
    div.lock-loading .progress mat-progress-spinner{
        left: 50%;
        position: relative;
        margin-left: -50px;
    }
    .progress h4{
        text-align: center;
        color: #737373;
        text-shadow: 1px 1px 4px #868686;
    }
  `],
  template: `
    <div class="lock-loading" *ngIf="showing">
        <div class="progress">
            <mat-progress-spinner mode="indeterminate" color="accent"></mat-progress-spinner>
            <h4>{{message}}</h4>
        </div>
    </div>
  `
})
export class LoadingComponent { 
    message:string;
    showing:boolean = false;

    constructor(){
        this.message = '';
    }
    show(message?:string){
        if( this.showing == false){
            this.showing = true;
            this.message = message || '';
        }
    }

    hidden(){
        this.showing = false;
        this.message = '';
    }
}