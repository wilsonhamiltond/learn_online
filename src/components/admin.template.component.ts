import { Component, ViewChild, ViewContainerRef, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { UserService, GetUser } from '../services/security/user.service';
import { OnSetLinks, OnLogoffChange, OnTitleChange } from '../services/utils/utils.service';

/* Childs Component */
import { LoadingComponent } from '../modules/utils/components/loading.component';
import { ILink } from '../models/utils/link.model';
import { NotifyService } from '../services/utils/notify.service';
import { IUser } from '../models/security/user.model';
import { IModule } from '../models/security/module.model';
import { ShowLoginChange, HideLoginChange } from '../services/utils/loading.service';
import { ConfirmDialog } from '../modules/utils/components/confirm.dialog';
import { MatDialog } from '@angular/material';

declare var window: any;
@Component({
  selector: 'admin-template',
  styleUrls: ['./admin.template.component.css'],
  templateUrl: './admin.template.component.html',
  providers: [UserService]
})
export class AdminTemplateComponent implements OnInit, AfterViewChecked {
  @ViewChild(LoadingComponent)
  loadingComponent: LoadingComponent = new LoadingComponent();

  links: ILink[] = [];
  title: string = 'Inicio';
  user: IUser;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    public notify: NotifyService,
    private cdRef:ChangeDetectorRef
  ) {
    OnSetLinks.subscribe((links: ILink[]) => {
      this.links = links || [];
      if (links.length > 0)
        this.title = links[links.length - 1].title;
    });
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  ngOnInit() {

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart)
        this.loadingComponent.show();

      if (event instanceof NavigationEnd)
        this.loadingComponent.hidden();
    })

    OnTitleChange.subscribe((title: string) => {
      this.title = title;
    })
    ShowLoginChange.subscribe(() => {
      this.loadingComponent.show();
    })
    HideLoginChange.subscribe(() => {
      this.loadingComponent.hidden();
    })
    OnLogoffChange.subscribe(() => {
      this.userService.logout().subscribe((response) => {
        delete this.user;
        this.notify.warning(response.message, 'Usuario');
        this.router.navigate(['/site/home'])
      });
    })
    this.user = GetUser();
    window.document.body.style.overflow = 'auto';
  }

  logout() {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.componentInstance.load({
      message: '¿Desea cerrar sessión?',
      title: 'CONFIRMACIÓN',
      cancel: 'No',
      accent: 'Si'
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.logout().subscribe((response) => {
          delete this.user;
          this.notify.success(response.message, 'Usuario');
          this.router.navigate(['/site/home'])
        });
      }
    })
  }

  showMenu(url: string): boolean {
    let user: IUser = GetUser();
    if (!user)
      return false;
    return user.modules.some((module: IModule) => {
      return url == module.url;
    });
  }
}