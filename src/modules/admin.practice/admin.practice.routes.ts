import { Routes, RouterModule } from '@angular/router';
import { PracticeListComponent } from './components/list.component';
import { PracticeCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component';
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: ':stage_id/list',
                component: PracticeListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':stage_id/:_id/create',
                component: PracticeCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminPracticeRouting = RouterModule.forChild(routes);