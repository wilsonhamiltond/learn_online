import { Component, OnInit, ViewChild } from '@angular/core';
import { GetUser, UserService } from '../services/security/user.service';
import { LoadingService } from '../services/utils/loading.service';
import { Router } from '@angular/router';

import { NotifyService } from '../services/utils/notify.service';
import { OnLoginChange } from '../services/utils/utils.service';
import { ConfirmDialog } from '../modules/utils/components/confirm.dialog';
import { MatDialog } from '@angular/material';
import { IUser } from '../models/security/user.model';


@Component({
    selector: 'site-header',
    styles: [`
    header nav .logo{
        width: 96px;
    }
    header nav ul{
        margin: 0px;
        color: black;
        font-size: 0;
    }
    header nav ul li{
        display: inline-block;
        padding: 13px 15px;
        font-size: 12pt;
        border-left: 1px solid #eeeeee;
    }
    header nav ul li i.material-icons{
        position: relative;
        top: 5px;
    }
    
    header nav ul li:last-of-type{
        border-right: 1px solid #eeeeee;
    }
    header nav ul li.active{
        background: #eeeeee;
    }
    header nav ul li:hover{
        background: #f7f7f7;
    }
    a.logo{
        font-family: 'Love Ya Like A Sister', cursive;
        font-size: 25pt;
    }
    ul li a{
        text-decoration: none;
        color: #9e9e9e;
    }
    ul li a img.avatar{
        width: 32px;
        height: 32px;
    }
    ul li.profile{
        padding-bottom: 7px !important;
        padding-top: 10px !important;
    }
    [mat-menu-item] i.material-icons.fa{
        margin-right: 0px;
        font-size: 16pt;
    }
    [mat-menu-item]:hover:not([disabled]), [mat-menu-item]:focus:not([disabled]){
        background: rgba(255,255,255,0.25) !important;
    }
    .menu-xs{
        display: block !important;
    }
    .menu-xs ul, .menu-xs ul li{
        width: 100%;
        padding: 0;
    }
  `],
    templateUrl: './site.header.component.html',
    providers: [UserService, LoadingService]
})
export class SiteHeaderComponent implements OnInit {

    menu_xs: boolean = false;
    user: IUser;
    constructor(
        private userService: UserService,
        private notify: NotifyService,
        private router: Router,
        public dialog: MatDialog,
        private loading: LoadingService
    ) {
        this.user = GetUser();
    }

    toggleMenu() {
        this.menu_xs = !this.menu_xs;
    }

    ngOnInit() {
        OnLoginChange.subscribe((user: any) => {
            this.user = user;
        })
    }

    logOut() {
        let dialogRef = this.dialog.open(ConfirmDialog);
        dialogRef.componentInstance.load({
            message: '¿Desea cerrar la sessión?',
            title: 'CONFIRMACIÓN',
            cancel: 'No',
            accent: 'Si'
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.loading.show('Cerrando sessión');
                this.userService.logout().subscribe((response) => {
                    this.loading.hide();
                    this.user = GetUser();
                    this.notify.success(response.message, 'Sessión finalizada');
                    this.router.navigate(['/site/home']);
                })
            }
        });
    }
}