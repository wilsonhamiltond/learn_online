import { Routes, RouterModule } from '@angular/router';
import { UnauthorizeComponent } from './components/unauthorize.component';
import { AdminTemplateComponent } from './components/admin.template.component';
import { SiteTeplateComponent } from './components/site.template.component';
import { ProfilTemplateComponent } from './components/profile.template.component';
import { InstituteTemplateComponent } from './components/institut.template.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: '/site/home',
        pathMatch: 'full'
    },
    {
        path: 'unauthorize',
        component: UnauthorizeComponent 
    },
    { 
        path: 'site',
        component:  SiteTeplateComponent,
        children: [
            {
                path: '', 
                loadChildren: './modules/site.home/site.home.module#SiteHomeModule'
            },
            {
                path: 'contact', 
                loadChildren: './modules/site.contact/site.contact.module#SiteContactModule'
            },
            {
                path: 'security', 
                loadChildren: './modules/site.security/site.security.module#SiteSecurityModule'
            },
            {
                path: 'training', 
                loadChildren: './modules/site.training/site.training.module#SiteTrainingModule'
            }
        ]
    },
    { 
        path: 'profile',
        component:  ProfilTemplateComponent,
        children: [
            {
                path: '', 
                loadChildren: './modules/profile.home/profile.home.module#ProfileHomeModule'
            },
            {
                path: 'security', 
                loadChildren: './modules/profile.security/profile.security.module#ProfileSecurityModule'
            },
            {
                path: 'training', 
                loadChildren: './modules/profile.training/profile.training.module#ProfileTrainingModule'
            }
        ]
    },
    { 
        path: 'institute/:training_id',
        component:  InstituteTemplateComponent,
        children: [
            {
                path: '', 
                loadChildren: './modules/institute.home/institute.home.module#InstituteHomeModule'
            },
            {
                path: 'material', 
                loadChildren: './modules/institute.material/institute.material.module#InstituteMaterialModule'
            },
            {
                path: 'test', 
                loadChildren: './modules/institute.test/institute.test.module#InstituteTestModule'
            }
        ]
    },
    { 
        path: 'admin',
        component:  AdminTemplateComponent,
        children: [
            {
                path: '', 
                loadChildren: './modules/admin.home/admin.home.module#AdminHomeModule'
            },
            {
                path: 'catalog', 
                loadChildren: './modules/admin.catalog/admin.catalog.module#AdminCatalogModule'
            },
            {
                path: 'user', 
                loadChildren: './modules/admin.user/admin.user.module#AdminUserModule'
            },
            {
                path: 'role', 
                loadChildren: './modules/admin.role/admin.role.module#AdminRoleModule'
            },
            {
                path: 'category', 
                loadChildren: './modules/admin.category/admin.category.module#AdminCategoryModule'
            },
            {
                path: 'training', 
                loadChildren: './modules/admin.training/admin.training.module#AdminTrainingModule'
            },
            {
                path: 'section', 
                loadChildren: './modules/admin.section/admin.section.module#AdminSectionModule'
            },
            {
                path: 'stage', 
                loadChildren: './modules/admin.stage/admin.stage.module#AdminStageModule'
            },
            {
                path: 'material', 
                loadChildren: './modules/admin.material/admin.material.module#AdminMaterialModule'
            },
            {
                path: 'test', 
                loadChildren: './modules/admin.test/admin.test.module#AdminTestModule'
            },
            {
                path: 'question', 
                loadChildren: './modules/admin.question/admin.question.module#AdminQuestionModule'
            },
            {
                path: 'practice', 
                loadChildren: './modules/admin.practice/admin.practice.module#AdminPracticeModule'
            },
            {
                path: 'forum', 
                loadChildren: './modules/admin.forum/admin.forum.module#AdminForumModule'
            }
        ]
    }/*
    {
        path: 'institute/:training_id', 
        loadChildren: './modules/institute/institute.module#InstituteModule'
    }*/
];

export const routing = RouterModule.forRoot(routes); 