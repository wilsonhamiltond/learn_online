import { Component, ViewChild, NgZone, Pipe, PipeTransform, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from '../../utils/components/video.player.component';
import { LoadingService } from '../../../services/utils/loading.service';
import { MaterialService, MATERIAL_TYPE_ENUM } from '../../../services/training/material.service';
import { IMaterial, MaterialModel } from '../../../models/training/material.model';
import { IResponse } from '../../../models/utils/response.model';
import { IMedia } from '../../../models/training/media.model';
import { setMaterialEndObservable, setMaterialChangeObservable } from '../../../services/utils/utils.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var window:any;

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
    selector: 'material-show',
    styles: [`
        video-player{
            height: 100%;
            display: block;
        }
        div.overload{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1001;
            background-color: #aaa;
        }
        div.overload .progress{    
            width: 100px;
            height: 200px;
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -50px;
            margin-top: -100px;
            background-color: transparent;
        }
        div.overload .progress span{
            font-size: 9pt;
            top: -60px;
            position: relative;
        }
        
        div.height{
            height: 100%;
        }
    `],
    templateUrl: './show.componenet.html',
    providers: [LoadingService, MaterialService]
})
export class MaterialShowComponent implements OnInit {
    @ViewChild(VideoPlayerComponent)
    videoPlayerComponent: VideoPlayerComponent;

    material: IMaterial;

    material_type = MATERIAL_TYPE_ENUM;
    constructor(
        private loadingService: LoadingService,
        private activatedRoute: ActivatedRoute,
        private materialService: MaterialService
    ) {
        this.activatedRoute.params.subscribe( (params) =>{
            var material_id = params['material_id'];
            
            this.loadingService.show('Cargando...');
            this.material = new MaterialModel();
            this.materialService.get( material_id, true).subscribe( (response:IResponse) =>{
                if( response.result == true){
                    this.loadingService.hide();
                    this.material = <IMaterial>response.doc;

                    setMaterialChangeObservable.next(this.material);
                    if(this.material.type._id == this.material_type.embed){
                        setTimeout(() => {
                            this.videoEnd(this.material.media);
                            (window.adsbygoogle = window.adsbygoogle || []).push({});
                        }, 2000);
                    }else{
                        this.material.media.duration = this.material.media.duration / 2;
                    }
                }else{
                    console.log('Material no found');
                }
            });
        });

    }
    
    ngOnInit(){
    }

    videoEnd(media: IMedia){
        if( this.material.media._id != media._id ){
            return;
        }
        setMaterialEndObservable.next(false);
    }

    next(){
        setMaterialEndObservable.next(true);
    }
}
