import { Component, OnInit, Input } from '@angular/core';
import { IMedia } from '../../../models/training/media.model';
import { ICatalog } from '../../../models/security/catalog.model';
import { CatalogService } from '../../../services/security/catalog.service';
import { IResponse } from '../../../models/utils/response.model';

@Component({
    selector: 'embed-media',
    templateUrl: './embed.media.component.html'
})
export class EmbedMediaComponent implements OnInit {
    @Input()
    media: IMedia;

    file_types:ICatalog[] = [];

    constructor(
        private catalogService:CatalogService
    ) { }

    ngOnInit() {
        if(!this.media._id){
            this.media.name = ' ';
            this.media.duration = 0;
        }
        this.catalogService.file_types().subscribe( (response:IResponse) =>{
            if(response.result){
                this.file_types = response.docs;
            }
        })
    }

}