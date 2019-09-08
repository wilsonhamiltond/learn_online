import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../../../services/training/training.service';
import { ITraining } from '../../../models/training/training.model';
import { IResponse } from '../../../models/utils/response.model';
import { LoadingService } from '../../../services/utils/loading.service';
import { VideoPlayerComponent } from '../../utils/components/video.player.component';
import { ICategory } from '../../../models/training/category.model';
import { GetUser } from '../../../services/security/user.service';
import { EnrollmentService, ENROLLMENT_STATUS_ENUM } from '../../../services/training/enrollment.service';
import { EnrollmentModel } from '../../../models/training/enrollment.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { ConfirmDialog } from '../../utils/components/confirm.dialog';
import { MatDialog } from '@angular/material';
import { SECTION_STATUS_ENUM } from '../../../services/training/section.service';
import { IStage } from '../../../models/training/stage.model';
import { IMaterial } from '../../../models/training/material.model';
import { MATERIAL_TYPE_ENUM } from '../../../services/training/material.service';
import { forkJoin } from 'rxjs';
import { IUser } from 'src/models/security/user.model';

declare var window: any;

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
    selector: 'training-detiails',
    templateUrl: './details.component.html',
    providers: [LoadingService, TrainingService, NotifyService, EnrollmentService]
})
export class TrainingDetailsComponent implements OnInit {
    @ViewChild(VideoPlayerComponent)
    videoPlayerComponent: VideoPlayerComponent;

    @ViewChild('menu')
    menu: ElementRef;

    training: ITraining;

    preload: string = 'auto';

    fixes: boolean = false;
    hours: number = 0;
    minutes: number = 0;
    material_lenght: number = 0;
    videos_lenght: number = 0;
    test_lenght: number = 0;
    subcription_status: string = SECTION_STATUS_ENUM.subcription;
    user: IUser;
    constructor(
        private loadingService: LoadingService,
        private trainingService: TrainingService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private zone: NgZone,
        private notify: NotifyService,
        private dialog: MatDialog,
        private enrollmentService: EnrollmentService
    ) {
        this.user = GetUser();
    }

    ngOnInit() {
        var menuTop = this.menu.nativeElement.offsetTop;
        window.onscroll = () => {
            if (menuTop < window.document.body.scrollTop) {
                this.fixes = true;
            } else {
                this.fixes = false
            }
            this.zone.run(() => { });
        }

        this.activatedRoute.params.subscribe((params) => {
            this.loadingService.show('Cargando');
            let training_id = params['training_id'];
            this.trainingService.details(training_id).subscribe((response: IResponse) => {
                this.training = <ITraining>response.doc;
                this.get_quantity();
                this.loadingService.hide();
            })
        })
    }

    get_quantity() {
        let secounds: number = 0;
        this.training.section.stages.forEach((stage: IStage) => {
            this.test_lenght += stage.tests.length;
            stage.materials.forEach((material: IMaterial) => {
                if (material.type._id == MATERIAL_TYPE_ENUM.embed)
                    this.material_lenght += 1;
                else {
                    this.videos_lenght += 1;
                    secounds += material.media.duration;
                }
            })
        });
        this.minutes = Math.floor(secounds / 60);
        this.hours = Math.floor(this.minutes / 60);
        this.minutes = this.minutes - (this.hours * 60);
    }

    getCategories(category: ICategory): Array<ICategory> {
        var categories: Array<ICategory> = [];
        categories.push(category);
        if (category.parent_category.name) {
            categories = this.getCategories(category.parent_category).concat(categories);
        }
        return categories;
    }

    gotToCategory(category: string) {
        alert(category);
    }

    to_minute(secounds: number) {
        let minutes: number = Math.floor(secounds / 60);
        return `${minutes}:${secounds - (minutes * 60)}`;
    }

    register(training: ITraining) {
        if (this.user) {
            this.trainingService.subscribed(training.section._id).subscribe((response: any) => {
                if (!response.subscribed) {
                    let dialogRef = this.dialog.open(ConfirmDialog);
                    dialogRef.componentInstance.load({
                        message: '¿Desea inscribirte en este curso?',
                        title: 'CONFIRMACIÓN',
                        cancel: 'No',
                        accent: 'Si'
                    });
                    dialogRef.afterClosed().subscribe((result: boolean) => {
                        if (result)
                            this.subcribe(training)
                    })
                }else{
                    this.router.navigate([`/institute/${this.training.section._id}/home`]);
                }
            })
        } else {
            this.router.navigate([`/site/security/login/${training.section._id}`]);
        }
    }
    subcribe(training:ITraining) {
        this.loadingService.show('Inscribiendome en el curso...');
        let enrollment: any = new EnrollmentModel();
        enrollment.person = this.user.person._id;
        enrollment.status = ENROLLMENT_STATUS_ENUM.subscribed;
        enrollment.section = training.section._id;
        this.enrollmentService.save(enrollment).subscribe((response: IResponse) => {
            if (response.result) {
                this.notify.success('Se ha inscrito en el curso correctamente.', 'Inscripción')
                setTimeout(() => {
                    this.router.navigate([`/institute/${this.training.section._id}/home`]);
                }, 100)
            } else {
                this.loadingService.hide();
                this.notify.error(response.message, 'Error en inscripción')
            }
        })
    }
}