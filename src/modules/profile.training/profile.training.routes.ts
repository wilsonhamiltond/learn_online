import { Routes, RouterModule } from '@angular/router'

/* Components */
import { TemplateComponent } from '../utils/components/template.component';

import { TrainingHistoryComponent } from './components/history.component';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [{
            path: 'history', component: TrainingHistoryComponent
        }]
    }
];

export const ProfileTrainingRouting = RouterModule.forChild(routes);