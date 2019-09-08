import { RouterModule, Routes } from '@angular/router';
import { CanActivateService } from '../../services/security/can.active.service';

import { TestShowComponent } from './components/show.componenet';
import { QuestionShowComponent } from './components/question.componenet';
import { TestResultComponent } from './components/result.componenet';
import { TemplateComponent } from '../utils/components/template.component';

const routes: Routes = [
    { 
        path: '',
        component: TemplateComponent,
        children: [{ 
                path: ':test_id/show', component: TestShowComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },{ 
                path: ':test_id/questions', component: QuestionShowComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },{ 
                path: ':test_id/result', component: TestResultComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const InstituteTestRouting = RouterModule.forChild(routes);