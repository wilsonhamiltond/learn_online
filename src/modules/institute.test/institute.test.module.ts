import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UtilsModule } from '../utils/utils.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestShowComponent } from './components/show.componenet';
import { QuestionShowComponent } from './components/question.componenet';

/*  COMPONENET CHILDS  */
import { OneSelectComponent } from './components/one.select.component';
import { MultipleSelectComponent } from './components/multiple.select.component';
import { TestResultComponent } from './components/result.componenet';

import { InstituteTestRouting } from './institute.test.route';
import { MatCardModule, MatRadioModule, MatCheckboxModule, MatButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        MatCardModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        ReactiveFormsModule,
        FormsModule,
        UtilsModule,
        InstituteTestRouting
    ],
    declarations: [
        TestShowComponent,
        QuestionShowComponent,
        OneSelectComponent,
        MultipleSelectComponent,
        TestResultComponent
    ]
})
export class InstituteTestModule { }