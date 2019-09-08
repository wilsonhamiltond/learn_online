import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialShowComponent, SafePipe } from './components/show.componenet';

import { InstituteMaterialRouting } from './institute.material.route';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        UtilsModule,
        InstituteMaterialRouting
    ],
    declarations: [ 
        MaterialShowComponent,
        SafePipe
    ]
})
export class InstituteMaterialModule { }