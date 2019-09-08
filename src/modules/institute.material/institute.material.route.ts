import { RouterModule, Routes } from '@angular/router';
import { CanActivateService } from '../../services/security/can.active.service';

import { MaterialShowComponent } from './components/show.componenet';
import { TemplateComponent } from '../utils/components/template.component';

const routes: Routes = [
    { 
        path: '',
        component: TemplateComponent,
        children: [{ 
                path: ':material_id/show', component: MaterialShowComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const InstituteMaterialRouting = RouterModule.forChild(routes);