import { Routes, RouterModule } from '@angular/router'

/* Components */
import { TemplateComponent } from '../utils/components/template.component';
import { HomeComponent } from './components/home.component';
import { SuccessComponent } from './components/success.component';
import { ErrorComponent } from './components/error.component';

import { PolicyComponent } from './components/policy.component';
import { TermsComponent } from './components/terms.component';
const routes: Routes = [
    {
        path: 'home',
        component: TemplateComponent,
        children: [
            { 
                path: '', component: HomeComponent
            },{ 
                path: 'terms', component: TermsComponent
            },{ 
                path: 'policy', component: PolicyComponent
            },{ 
                path: 'success/:message', component: SuccessComponent
            },{ 
                path: 'error/:message', component: ErrorComponent
            }
        ]
    }
];

export const SiteHomeRouting = RouterModule.forChild(routes);