import { Routes, RouterModule } from '@angular/router';
import { QuestionListComponent } from './components/list.component';
import { QuestionCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component';
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: ':test_id/list',
                component: QuestionListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':test_id/:_id/create',
                component: QuestionCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminQuestionRouting = RouterModule.forChild(routes);