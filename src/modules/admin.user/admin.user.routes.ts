import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './components/list.component';
import { UserCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component'
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'list',
                component: UserListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/create',
                component: UserCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminUserRouting = RouterModule.forChild(routes);