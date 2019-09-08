import { Component, ViewChild, ViewContainerRef, OnInit, ChangeDetectorRef } from '@angular/core';

/* Childs Component */
import { SiteHeaderComponent } from './site.header.component';
import { SiteFooterComponent } from './site.footer.component';
import { ShowLoginChange, HideLoginChange } from '../services/utils/loading.service';
import { LoadingComponent } from '../modules/utils/components/loading.component';
import { OnLogoffChange } from '../services/utils/utils.service';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';

declare var window: any;

@Component({
  selector: 'site-template',
  styles: [`
    div.main{
      width: 100%;
      background-color: #eee;
      box-shadow: 0px -4px 10px -3px gainsboro;
    }
  `],
  templateUrl: './site.template.component.html'
})
export class SiteTeplateComponent implements OnInit {
  @ViewChild(LoadingComponent)
  loadingComponent: LoadingComponent = new LoadingComponent();

  @ViewChild(SiteHeaderComponent)
  headerComponent: SiteHeaderComponent;

  @ViewChild(SiteFooterComponent)
  footerComponent: SiteFooterComponent;

  bgImage: string = 'url(assets/images/image-bg-1.jpg)';
  imageCount: number = 0;
  bgImages: Array<string> = [
    'url(assets/images/image-bg-1.jpg)'
    , 'url(assets/images/image-bg-2.jpg)'
    , 'url(assets/images/image-bg-3.jpg)'
    , 'url(assets/images/image-bg-4.jpg)'
    , 'url(assets/images/image-bg-5.jpg)'
  ];
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    ShowLoginChange.subscribe(() => {
      this.loadingComponent.show();
    })
    HideLoginChange.subscribe(() => {
      this.loadingComponent.hidden();
    })
    OnLogoffChange.subscribe(() => {
    })

    window.setInterval(() => {
      if ((this.imageCount + 1) < this.bgImages.length) {
        this.imageCount++;
      } else {
        this.imageCount = 0;
      }
      this.bgImage = this.bgImages[this.imageCount];
    }, 5000)
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart)
        this.loadingComponent.show();

      if (event instanceof NavigationEnd)
        this.loadingComponent.hidden();
    })
    window.document.body.style.overflow = 'auto';
    setTimeout(() => {
      if(!window.adsbygoogle){
        (window.adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-8751008385090221",
          enable_page_level_ads: true
        });
      }
    }, 1000)
  }
 }