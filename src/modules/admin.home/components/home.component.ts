import { Component, OnInit } from '@angular/core';

import { UtilsService } from '../../../services/utils/utils.service';
import { UserService } from '../../../services/security/user.service';
import { TrainingService } from '../../../services/training/training.service';
import { SectionService } from '../../../services/training/section.service';
import { EnrollmentService } from '../../../services/training/enrollment.service';
import { IResponse } from '../../../models/utils/response.model';

@Component({
    templateUrl: './home.component.html',
    providers: [UtilsService, UserService, TrainingService, SectionService, EnrollmentService]
})
export class HomeComponent implements OnInit{
    user: any;
    section: any;
    training: any;
    enrollment: any;
    constructor(
        private utilsService: UtilsService,
        private userService: UserService,
        private trainingService: TrainingService,
        private sectionService: SectionService,
        private enrollmentService: EnrollmentService
    ){
    }

    ngOnInit(){
        this.utilsService.setLinks([{
            title: 'Administración',
            active: true
            }
        ]);
        this.users();
        this.trainings();
        this.sections();
        this.enrollments();
    }

    users(){
        this.userService.filter({
            fileds: {
                status: 1
            }
        }).subscribe((response: IResponse) =>{
            if(response.result){
                this.user = {
                    total: response.docs.length
                }
            }
        })
    }

    trainings(){
        this.trainingService.filter({
            fileds: {
                status: 1
            }
        }).subscribe((response: IResponse) =>{
            if(response.result){
                this.training = {
                    total: response.docs.length
                }
            }
        })
    }

    sections(){
        this.sectionService.filter({
            fileds: {
                status: 1
            }
        }).subscribe((response: IResponse) =>{
            if(response.result){
                this.section = {
                    total: response.docs.length
                }
            }
        })
    }
    
    enrollments(){
        this.enrollmentService.filter({
            fileds: {
                status: 1
            }
        }).subscribe((response: IResponse) =>{
            if(response.result){
                this.enrollment = {
                    total: response.docs.length
                }
            }
        })
    }
}