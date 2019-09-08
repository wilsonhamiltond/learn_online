import { Routes, RouterModule } from '@angular/router';
import { RoleListComponent } from './components/list.component';
import { RoleCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component'
import { RoleModulesComponent } from './components/modules.component';
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'list',
                component: RoleListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/create',
                component: RoleCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/modules',
                component: RoleModulesComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminRoleRouting = RouterModule.forChild(routes);