import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { ICategory } from '../../../models/training/category.model';
import { MATERIAL_TYPE_ENUM } from '../../../services/training/material.service';
import { IStage } from '../../../models/training/stage.model';
import { ITraining } from '../../../models/training/training.model';
import { EnrollmentService } from '../../../services/training/enrollment.service';
import { NotifyService } from '../../../services/utils/notify.service';
import { LoadingService } from '../../../services/utils/loading.service';
import { SECTION_STATUS_ENUM } from '../../../services/training/section.service';
import { TrainingService } from '../../../services/training/training.service';
import { IMaterial } from '../../../models/training/material.model';
import { VideoPlayerComponent } from '../../utils/components/video.player.component';

@Component({
  styles: [`  
    .register{
        background-color: white;
    }
    h4 label{
        font-size: 14pt;
    }
    .border-top{
        border-top: 1px solid gray;
    }

    .player{    
        height: 430px;
        margin-bottom: 30px;
    }
    .author-avatar{
        height: 128px;
    }
    vg-fullscreen{
        position: absolute;
        right: 0;
    }
    .training-menu{
        border-top: solid 1px #bdbdbd;
        border-bottom: solid 1px #bdbdbd;
    }
    .training-menu ul{   
        list-style: none;
        font-size: 12pt;
        margin: 0;
    }
    .training-menu ul li{
        display: inline-block;
        padding-right: 25px;
    }
    .training-menu ul li a{
        color: gray;
        font-size: 14pt;
    }
    .training-menu ul li a:hover{
        color: #1ac2c1 !important;
    }
    .training-menu.active{
        position: fixed;
        top: 0;
        margin: 0;
        background-color: white;
        z-index: 1000;
    }
    #author h4{
        margin 5px 0px;
    }
    button.start{
        border-radius: 2px;
        margin: 0px 10px;
    }
    span.free{
        font-size: 18pt;
        color: green;
    }
    a.category{
        margin-right: 10px;
        padding: 10px;
        border-right: 1px solid gray;
        padding-bottom: 0px;
        padding-top: 0px;
    }

    a.category:last-of-type{
        border-right: 0;
    }
    .stage{
        border: solid 1.5px #d9d9d9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }
    .stage .title{
        width: 100%;
        background-color: #d9d9d9;
        padding: 10px;
        margin: 0;
    }
    .stage .material{
        width: 100%;
        border-bottom: solid 1px #d9d9d9;
        padding: 1px 5px;
        margin: 0;
    }
  `],
  selector: 'institut',
  templateUrl: './home.component.html',
  providers: [LoadingService, TrainingService, NotifyService, EnrollmentService]
})
export class HomeComponent {
  @ViewChild(VideoPlayerComponent)
  videoPlayerComponent: VideoPlayerComponent;

  @ViewChild('menu')
  menu: ElementRef;

  training: ITraining;

  preload:string = 'auto';
  
  fixes:boolean = false;
  hours: number = 0;
  minutes: number = 0;
  material_lenght:number = 0;
  videos_lenght:number = 0;
  test_lenght:number = 0;
  subcription_status:string = SECTION_STATUS_ENUM.subcription;
  constructor(
    private trainingService: TrainingService,
  ) {
    this.training = this.trainingService.getTraining();
    this.get_quantity();
  }

  get_quantity(){
      let secounds:number = 0;
      this.training.section.stages.forEach( (stage:IStage) =>{
          this.test_lenght += stage.tests.length;
          stage.materials.forEach((material:IMaterial) =>{
              if(material.type._id == MATERIAL_TYPE_ENUM.embed)
                  this.material_lenght += 1;
              else{
                  this.videos_lenght += 1;
                  secounds += material.media.duration;
              }
          })
      });
      this.minutes = Math.floor( secounds / 60 );
      this.hours = Math.floor( this.minutes / 60 );
      this.minutes = this.minutes - (this.hours * 60);
  }

  getCategories(category: ICategory): Array<ICategory>{
      var categories:Array<ICategory> = [];
      categories.push(category);
      if( category.parent_category.name){
          categories = this.getCategories(category.parent_category).concat(categories);
      }
      return categories;
  }

  gotToCategory(category:string){
      alert(category);
  }
  
  to_minute(secounds:number){
      let minutes:number = Math.floor(secounds / 60);
      return `${minutes}:${secounds - ( minutes * 60 )}`; 
  }
}