import { Routes, RouterModule } from '@angular/router';
import { MaterialListComponent } from './components/list.component';
import { MaterialCreateComponent } from './components/create.component';

import { TemplateComponent } from '../utils/components/template.component';
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: ':stage_id/list',
                component: MaterialListComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: ':stage_id/:_id/create',
                component: MaterialCreateComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const AdminMaterialRouting = RouterModule.forChild(routes);