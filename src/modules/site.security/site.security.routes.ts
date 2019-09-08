import { Routes, RouterModule } from '@angular/router'

/* Components */
import { TemplateComponent } from '../utils/components/template.component';
import { RecoverComponent } from './components/recover.component';
import { RecoverPasswordComponent } from './components/recover.password.component';

import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { VerifyComponent } from './components/verify.component';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [{
                path: 'login/:training_id', component: LoginComponent
            },{
                path: 'login', component: LoginComponent
            },{
                path: 'register', component: RegisterComponent
            },{
                path: 'user/:token/verify', component: VerifyComponent
            },{
                path: 'password/recover', component: RecoverComponent
            },{
                path: 'password/:token/recover', component: RecoverPasswordComponent
            }
        ]
    }
];

export const SiteSecurityRouting = RouterModule.forChild(routes);