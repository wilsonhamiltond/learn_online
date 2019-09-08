import { Routes, RouterModule } from '@angular/router'

/* Components */
import { TemplateComponent } from '../utils/components/template.component';

import { TrainingDetailsComponent } from './components/details.component';
import { TrainingSearchComponent } from './components/search.component';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [{
            path: 'search/:query', component: TrainingSearchComponent
        },{
            path: 'search', component: TrainingSearchComponent
        },{
            path: 'details/:training_id', component: TrainingDetailsComponent
        }]
    }
];

export const SiteTrainingRouting = RouterModule.forChild(routes);