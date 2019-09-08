import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';

/* Components */
import { EducateComponent }   from './educate.component';
import { UnauthorizeComponent } from './components/unauthorize.component';
/* Components*/
import { SiteTeplateComponent }   from './components/site.template.component';
import { SiteHeaderComponent } from './components/site.header.component';
import { SiteFooterComponent } from './components/site.footer.component';

/* Routes */
import { routing } from './educate.routes';

/* Modules */
import { UtilsModule } from './modules/utils/utils.module';

 /* Directives */
import { PasswordMatchDirective } from './directives/security/password.match.directive';

import { CanActivateService } from './services/security/can.active.service';
import 'hammerjs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminTemplateComponent } from './components/admin.template.component';
import { MatIconModule, MatSidenavModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { NotifyService } from './services/utils/notify.service';
import { ProfilTemplateComponent } from './components/profile.template.component';
import { InstituteTemplateComponent } from './components/institut.template.component';


@NgModule({
  imports: [ 
      MatIconModule,
      MatSidenavModule,
      CommonModule,
      BrowserModule,
      HttpModule,
      RouterModule,
      routing,
      BrowserAnimationsModule,
      UtilsModule
    ],
    declarations: [
        PasswordMatchDirective,
        EducateComponent,
        UnauthorizeComponent,
        AdminTemplateComponent,
        SiteTeplateComponent,
        SiteHeaderComponent,
        SiteFooterComponent,
        ProfilTemplateComponent,
        InstituteTemplateComponent
    ],
    bootstrap:    [ EducateComponent ],
    providers: [
        {
            provide: LocationStrategy, 
            useClass: HashLocationStrategy
        },{
            provide: 'CanAlwaysActivateGuard',
            useValue: () => {
              return true;
            }
        },
        NotifyService,
        CanActivateService
    ]
})
export class EducateModule { 
}