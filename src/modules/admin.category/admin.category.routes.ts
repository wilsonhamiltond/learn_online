import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './components/list.component';
import { CategoryCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component';
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'list',
                component: CategoryListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/create',
                component: CategoryCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminCategoryRouting = RouterModule.forChild(routes);