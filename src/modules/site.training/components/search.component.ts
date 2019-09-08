import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ISection } from '../../../models/training/section.model';
import { ActivatedRoute } from '@angular/router';
import { MEDIA_TYPE_ENUM } from '../../../services/training/media.service';
import { TrainingService } from '../../../services/training/training.service';
import { IResponse } from '../../../models/utils/response.model';
import { LoadingService } from '../../../services/utils/loading.service';
import { NotifyService } from '../../../services/utils/notify.service';

@Component({
    styleUrls: ['../../site.home/components/home.component.css'],
    selector: 'training-search',
    templateUrl: './search.component.html',
    providers: [TrainingService, LoadingService, NotifyService]
})
export class TrainingSearchComponent implements OnInit {
    sections: ISection[] = [];
    query: string = '';
    
    @ViewChild('search_text')
    search_text: ElementRef;
    
    constructor(
        private activeteRouter: ActivatedRoute,
        private trainingService: TrainingService,
        private loadingService: LoadingService,
        private notify: NotifyService
    ) { }

    ngOnInit() {
        this.activeteRouter.params.subscribe((params: any) => {
            this.query = params['query'] || '';
            this.search_text.nativeElement.value = this.query;
            this.load();
        })
    }
    
    load(){
        this.loadingService.show('');
        this.trainingService.populars(this.query).subscribe((response: IResponse) => {
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
        this.query = this.search_text.nativeElement.value;
        this.load();
    }

    isYoutube(media: any) {
        if (!media)
            return false;
        return media.type == MEDIA_TYPE_ENUM.youtube;
    }
}