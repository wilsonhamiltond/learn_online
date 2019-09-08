import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home.component';

import { TemplateComponent } from '../utils/components/template.component'
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'home',
                component: HomeComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const InstituteHomeRouting = RouterModule.forChild(routes);