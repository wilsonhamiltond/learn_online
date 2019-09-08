import { Routes, RouterModule } from '@angular/router'

/* Components */
import { TemplateComponent } from '../utils/components/template.component';
import { ContactComponent } from './components/contact.component';
const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [{
            path: 'form', component: ContactComponent
        }]
    }
];

export const SiteContactRouting = RouterModule.forChild(routes);