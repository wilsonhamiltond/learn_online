import { Routes, RouterModule } from '@angular/router';
import { CatalogListComponent } from './components/list.component';
import { CatalogCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component'
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'list',
                component: CatalogListComponent ,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':_id/create',
                component: CatalogCreateComponent ,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminCatalogRouting = RouterModule.forChild(routes);