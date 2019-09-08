import { Component, OnInit } from '@angular/core';
import { GetUser } from '../../../services/security/user.service';
import { UtilsService } from '../../../services/utils/utils.service';
import { IUser } from '../../../models/security/user.model';
import { NotifyService } from '../../../services/utils/notify.service';
import { IResponse } from '../../../models/utils/response.model';
import { IEnrollment } from '../../../models/training/enrollment.model';
import { EnrollmentService, ENROLLMENT_STATUS_ENUM } from '../../../services/training/enrollment.service';
import { TrainingService } from '../../../services/training/training.service';
import { ITraining } from '../../../models/training/training.model';
import { SectionService, SECTION_STATUS_ENUM } from '../../../services/training/section.service';
import { ISection } from '../../../models/training/section.model';
import { MEDIA_TYPE_ENUM } from '../../../services/training/media.service';

@Component({
    selector: 'profile',
    styles: [`
    .enrollment{
        border: solid 2px #aaaaaa;
        padding: 5px;
        border-radius: 4px;
        margin-bottom: 20px;
    }

    .enrollment img{
        margin-left: -30px;
        height: 64px;
        border: solid 1px #aaa;
        border-radius: 1px;
    }
  `],
    templateUrl: './home.component.html',
    providers: [UtilsService, EnrollmentService, TrainingService, SectionService]
})
export class HomeComponent implements OnInit {
    trainings: Array<ITraining> = [];
    user: IUser;

    IMPROGRESS_STATUS = SECTION_STATUS_ENUM.in_progres;
    constructor(
        private enrollmentService: EnrollmentService,
        private notify: NotifyService,
        private utilsService: UtilsService,
        private trainingService: TrainingService,
        private sectionService: SectionService
    ) { }

    ngOnInit() {
        this.utilsService.setLinks([
            {
                title: 'MIS CURSOS',
                active: true
            }
        ]);
        this.load();
    }

    isYoutube(media: any) {
        if (!media)
            return false;
        return media.type == MEDIA_TYPE_ENUM.youtube;
    }
    
    get_training( sections:ISection[] ){
        let training_ids = sections.map((section:ISection) =>{
            return section.training;
        });
        this.trainingService.filter({
            params: {
                _id: { $in: training_ids },
            },
            fields: {
                title: 1,
                media: {
                    thumbnail: 1,
                    url: 1
                }
            }
        }).subscribe((response:IResponse) =>{
            if(response.result){
                this.trainings = <ITraining[]>response.docs.map((training:any) =>{
                    sections.forEach(( section:ISection ) =>{
                        if(training._id == section.training)
                            training.section = section;
                    })
                    return training;
                })
            }
            this.utilsService.hide();
        })
    }

    get_sections(enrollments:IEnrollment[]){
        let section_ids = enrollments.map((enroll: IEnrollment) => {
            return enroll.section;
        })
        this.sectionService.filter({
            params: {
                _id: { $in: section_ids },
                status: { $in: [
                    SECTION_STATUS_ENUM.in_progres,
                    SECTION_STATUS_ENUM.subcription
                ] }
            },
            fields: {
                code: 1,
                author: {
                    name: 1,
                    last_name: 1
                },
                start_date: 1,
                end_date: 1,
                status: {
                    _id: 1,
                    name: 1
                },
                training: 1,
                tutorial: 1
            }
        }).subscribe((response:IResponse) =>{
            if(response.result){
                let sections = <ISection[]>response.docs;
                this.get_training(sections);
            }else
                this.utilsService.hide();
        })
    }
    
    load() {
        this.utilsService.show('Cargando...');
        let user: IUser = GetUser();
        this.enrollmentService.filter({
            params: {
                person: user.person._id,
                status: ENROLLMENT_STATUS_ENUM.subscribed
            },
            fields: {
                section: 1,
                status: 1
            }
        }).subscribe((response: IResponse) => {
            if (response.result == true) {
                let enrollments = <Array<IEnrollment>>response.docs;
                this.get_sections(enrollments);
            } else {
                this.utilsService.hide();
                this.notify.error(response.message, "Aviso");
            }
        });
    }
}