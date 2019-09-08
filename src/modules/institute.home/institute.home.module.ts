import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*  COMPONENET CHILDS  */
import { HomeComponent } from './components/home.component';

import { InstituteHomeRouting } from './institute.home.route';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        UtilsModule,
        InstituteHomeRouting
    ],
    declarations: [ 
        HomeComponent
    ]
})
export class InstituteHomeModule {
 }