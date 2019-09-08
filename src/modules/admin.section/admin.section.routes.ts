import { Routes, RouterModule } from '@angular/router';
import { SectionListComponent } from './components/list.component';
import { SectionCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component';
import { CanActivateService } from '../../services/security/can.active.service';
import { EnrollmentsListComponent } from './components/enrrollments.component';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'list',
                component: SectionListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/create',
                component: SectionCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/enrollments',
                component: EnrollmentsListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':training_id/list',
                component: SectionListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':training_id/:_id/create',
                component: SectionCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminSectionRouting = RouterModule.forChild(routes);