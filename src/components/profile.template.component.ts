import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, RoutesRecognized} from '@angular/router';
import { UserService, GetUser } from '../services/security/user.service';
import { ILink } from '../models/utils/link.model';
import { OnSetLinks, UtilsService } from '../services/utils/utils.service';
import { NotifyService } from '../services/utils/notify.service';
import { ShowLoginChange, HideLoginChange } from '../services/utils/loading.service';
import { LoadingComponent } from '../modules/utils/components/loading.component';
import { Subscription } from 'rxjs';

/* Childs Component */
declare var window: any;

@Component({
    styleUrls: ['./profile.template.component.css'],
    selector: 'profile',
    templateUrl: './profile.template.component.html',
    providers: [UserService, UtilsService]
})
export class ProfilTemplateComponent implements OnInit, OnDestroy {
    user: any;
    menu_xs: boolean = false;
    links: Array<ILink> = [];
    @ViewChild(LoadingComponent)
    loadingComponent: LoadingComponent = new LoadingComponent();

    router_suscriber:Subscription;
    title: string = '';
    constructor(
        private userService: UserService,
        private router: Router,
        private notify: NotifyService,
        private zone: NgZone,
        private utilsService: UtilsService
    ) { 
        this.router_suscriber = this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                this.utilsService.show();
            }

            if (event instanceof NavigationEnd) {
                this.utilsService.hide();
            }
            if( event instanceof RoutesRecognized){
                this.utilsService.show();
                this.title = '';
            }
        })
    }

    toggleMenu() {
        this.menu_xs = !this.menu_xs;
    }

    ngOnInit() {
        OnSetLinks.subscribe((links:ILink[]) => {
            if(links.length > 0){
                this.title = links[0].title;
                this.zone.run(() =>{})
            }
        });
        ShowLoginChange.subscribe(() => {
            this.loadingComponent.show();
        })
        HideLoginChange.subscribe(() => {
            this.loadingComponent.hidden();
        })
        this.user = GetUser();
        window.document.body.style.overflow = 'hidden';
    }
    logout() {
        this.userService.logout().subscribe((response) => {
            delete this.user;
            this.notify.warning(response.message, 'Usuario');
            this.router.navigate(['/site/home'])
        });
    }
    ngOnDestroy(){
        this.router_suscriber.unsubscribe();
    }
}