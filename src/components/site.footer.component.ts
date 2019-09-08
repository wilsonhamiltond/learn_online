import { Component } from '@angular/core';
@Component({
  selector: 'site-footer',
  styles: [`
    footer{
        position: absolute;
        top: 100%;
        bottom: 100%;
        width: 100%;
        color: #eee;
    }
    footer .copyright{
        box-shadow: 0px -4px 4px -2px #999;
        background-color: #333;
        padding-bottom: 15px;
    }
    img.logo{
        width: 128px;
        background: white;
        border-radius: 3px;
        box-shadow: 0px 3px 7px 0px #808080;
    }
    img.logo-xs{
        margin-right: 15px;
        width: 32px;
    }
    .site-map{
        margin-top: 20px;
        list-style-type: none;
        padding-left: 0;
    }
  `],
  templateUrl: './site.footer.component.html'
})
export class SiteFooterComponent { 
    currentDate = new Date().getFullYear();
}