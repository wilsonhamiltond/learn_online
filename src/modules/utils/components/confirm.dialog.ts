import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
@Component({
    selector: 'confirm-dialog',
    template: 
    `
    <div class="col-md-12 no-padding">
        <div mat-dialog-title>{{title}}</div>
        <mat-dialog-content>
            <h4>
                {{message}}
            </h4>
        </mat-dialog-content>
        <div mat-dialog-actions>
            <button type="button" class="margin-right-sm" (click)="close()" mat-raised-button color="warn">
                <i  class="material-icons link">close</i>{{cancel_text}}</button>
            <button type="button" (click)="done()" mat-raised-button color="primary">
                {{accept_text}} <i  class="material-icons link">check</i></button>
        </div>
    </div>
    `
})

export class ConfirmDialog implements OnInit {
    public title:string = '';
    public message:string = '';
    public cancel_text:string = '';
    public accept_text:string = '';

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialog>,
        public dialog: MatDialog
    ) { 
    }
    ngOnInit(){
    }

    load(config:any){
        this.title = config.title || 'Confirmaciรณn';
        this.message = config.message;
        this.cancel_text = config.cancel || 'Cancelar';
        this.accept_text = config.accent || "Aceptar";
    }

    close(){
        this.dialogRef.close(false);
    }
    done(){
        this.dialogRef.close(true);
    }
}