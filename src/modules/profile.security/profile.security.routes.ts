import { Routes, RouterModule } from '@angular/router';
import { PasswordComponent } from './components/password.component';
import { UserComponent } from './components/user.component';

import { TemplateComponent } from '../utils/components/template.component'
import { CanActivateService } from '../../services/security/can.active.service';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            { 
                path: 'password',
                component: PasswordComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            },
            { 
                path: 'user',
                component: UserComponent,
                canActivate: [
                    'CanAlwaysActivateGuard',
                    CanActivateService
                ]
            }
        ]
    }
];

export const ProfileSecurityRouting = RouterModule.forChild(routes);