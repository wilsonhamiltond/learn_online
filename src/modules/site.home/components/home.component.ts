import { Component, OnInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingService } from '../../../services/training/training.service';
import { LoadingService } from '../../../services/utils/loading.service';

import { GetUser } from '../../../services/security/user.service';

import { NotifyService } from '../../../services/utils/notify.service';
import { IUser } from '../../../models/security/user.model';
import { IResponse } from '../../../models/utils/response.model';
import { ISection } from '../../../models/training/section.model';
import { MEDIA_TYPE_ENUM } from '../../../services/training/media.service';

@Component({
    styleUrls: ['./home.component.css'],
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [TrainingService, LoadingService]
})
export class HomeComponent implements OnInit, AfterContentInit {
    @ViewChild('search_text')
    search_text: ElementRef;

    sections: Array<ISection> = [];
    user: IUser;

    constructor(
        private trainingService: TrainingService,
        private loadingService: LoadingService,
        private notify: NotifyService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.user = GetUser();
    }

    ngAfterContentInit() {
        this.trainingService.populars().subscribe((response: IResponse) => {
            this.loadingService.hide();
            this.sections = <Array<ISection>>response.docs;
        });
    }
    
    search(event?:any) {
        if(event && event.keyCode != 13)
            return;
        if (this.search_text.nativeElement.value == '') {
            this.notify.warning('Digite el nombre del curso que desea.', 'Aviso');
            return;
        }
        this.router.navigate([`/site/training/search/${this.search_text.nativeElement.value}`])
    }

    isYoutube(media: any) {
        if (!media)
            return false;
        return media.type == MEDIA_TYPE_ENUM.youtube;
    }
}