import { Component, OnInit, NgZone, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { LoadingService, ShowLoginChange, HideLoginChange } from '../services/utils/loading.service';
import { TrainingService } from '../services/training/training.service';
import { MaterialService } from '../services/training/material.service';
import { UserService, GetUser } from '../services/security/user.service';
import { ITraining } from '../models/training/training.model';
import { IMaterial } from '../models/training/material.model';
import { ITest } from '../models/training/test.model';
import { NotifyService } from '../services/utils/notify.service';
import { IResponse } from '../models/utils/response.model';
import { IStage } from '../models/training/stage.model';
import { LoadingComponent } from '../modules/utils/components/loading.component';
import { OnMaterialChanage, OnMaterialEnd, OnTestChanage, OnURLChange, OnHiddeMenu, trainingTrigger } from '../services/utils/utils.service';
import { MaterialViewModel } from '../models/training/material.view.model';
import { MaterialViewService } from '../services/training/material.view.service';
import { EnrollmentService, ENROLLMENT_STATUS_ENUM } from '../services/training/enrollment.service';
import { IEnrollment } from '../models/training/enrollment.model';
import { SECTION_STATUS_ENUM } from 'src/services/training/section.service';

@Component({
    selector: 'institute',
    styleUrls: [ './institut.template.component.css' ],
    templateUrl: './institut.template.component.html', 
    providers: [ LoadingService, TrainingService, MaterialService, UserService, MaterialViewService, EnrollmentService]
})
export class InstituteTemplateComponent implements OnInit, AfterViewChecked {
    training: ITraining;
    material: IMaterial;
    test: ITest;

    last_material_id: string = '';

    user: any;

    @ViewChild('start')
    start: MatSidenav;
    
    @ViewChild(LoadingComponent)
    loadingComponent: LoadingComponent;

    training_id: string ='';
    hideMenuButton: boolean = false;
    
    enrollment:IEnrollment;
    ENROLLMENT_STATUS_ENUM = ENROLLMENT_STATUS_ENUM;

    show_ads:boolean = true;
    constructor(
        private notify: NotifyService,
        private zone: NgZone,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loadingService: LoadingService,
        private trainingService: TrainingService,
        private materialViewService: MaterialViewService,
        private enrollmentService: EnrollmentService,
        private userService: UserService,
        private cdRef:ChangeDetectorRef
    ) { 
        this.loadEvents();
    }

    ngAfterViewChecked()
    {
      this.cdRef.detectChanges();
    }

    ngOnInit() { 
        this.user = GetUser();
        this.activatedRoute.params.subscribe( (params) =>{
            this.training_id =  params['training_id'];
            this.load_enrollment();
            this.load();
        });
        
        this.router.events.subscribe((event:any) =>{
            if(event instanceof NavigationStart)
                this.loadingComponent.show();
            
            if(event instanceof NavigationEnd)
                this.loadingComponent.hidden();
        })
        setInterval(() =>{
            this.show_ads = false;
            this.zone.run(() =>{});
            setTimeout(() =>{
                this.show_ads = true;
                this.zone.run(() =>{});
            },2000)
        }, 35000)
    }

    load_enrollment(){
        this.enrollmentService.filter({
            params: {
                section: this.training_id,
                person: this.user.person._id,
                status: {
                    $in: [ 
                        ENROLLMENT_STATUS_ENUM.subscribed,
                        ENROLLMENT_STATUS_ENUM.finished,
                    ]
                }
            },
            fields: {
                person: 1,
                section: 1,
                status: 1
            },
            limit: 1
        }).subscribe(( response:IResponse) =>{
            if(response.result && response.docs.length > 0)
                this.enrollment = <IEnrollment>response.docs[0];
        })
    }

    load(){
        this.loadingService.show('Cargando...');
        this.trainingService.details(this.training_id).subscribe( (response:IResponse) =>{
            this.loadingService.hide();
            if(response.result == true){
                this.training = <ITraining>response.doc;
                this.trainingService.setTraining(this.training);
                let stageLenght:number = this.training.section.stages.length,
                    materialLenght:number = this.training.section.stages[stageLenght -1].materials.length;
                if(this.training.section.stages[stageLenght-1].materials.length > 0)
                    this.last_material_id = this.training.section.stages[stageLenght-1].materials[materialLenght -1]._id

                this.verify_enrollment();
            }else{
                console.log('training no found')
            }
        });
    }

    materialViewSave(){
        this.training.section.stages.forEach( (stage:IStage, stageIndex:number)=>{
            stage.materials.forEach( (material:IMaterial, materialIndex: number)=>{
                if( material._id == this.material._id ){
                    if( !material.viewed){
                        var view = new MaterialViewModel();
                        view.enrollment = this.training.section['enrollment'];
                        view.material = this.material;
                        view.person = this.user.person._id;
                        this.materialViewService.save(view).subscribe( (response:IResponse) =>{
                            if( response.result == true){
                                this.load();
                            }else{
                                this.notify.warning('Error marcando material como visto.')
                            }
                        });
                    }
                    return;
                }
            });
        })
    }
    
    loadEvents(){
        ShowLoginChange.subscribe(() => {
          this.loadingComponent.show();
        })
        HideLoginChange.subscribe(() => {
          this.loadingComponent.hidden();
        })
        OnMaterialChanage.subscribe( (material:IMaterial) =>{
            this.hideMenuButton = false;
            this.material = material;
            delete this.test;
            this.zone.run(()=>{});
        });
        OnTestChanage.subscribe( (test:ITest) =>{
            this.hideMenuButton = false;
            this.start.open();
            this.test = test;
            delete this.material;
            this.zone.run(()=>{});
        });
        OnMaterialEnd.subscribe( (end_video)=>{
            if(end_video == true){
                this.next();
            }else{
                this.materialViewSave();
            }
        });
        OnURLChange.subscribe( (url:string)=>{
            this.load();
            this.router.navigate([`/institute/${this.training_id}/${url}`]);
        })
        OnHiddeMenu.subscribe(()=>{
            this.start.close();
            this.hideMenuButton = true;
        })
    }

    previeus(){
        var materialId:string = this.material._id;
        this.training.section.stages.forEach( (stage:IStage, stageIndex:number)=>{
            stage.materials.forEach( (material:IMaterial, materialIndex: number)=>{
                if( material._id == materialId ){
                    if( materialIndex > 0){
                        this.material = stage.materials[materialIndex - 1 ];
                    }else{
                        this.material = this.training.section.stages[stageIndex -1 ].materials[this.training.section.stages[stageIndex -1 ].materials.length -1];
                    }
                    this.router.navigate([`/institute/${this.training.section._id}/material/${this.material._id}/show`]);
                    return;
                }
            });
        })
    }

    logout(){
        this.userService.logout().subscribe( (response) =>{
            this.user = GetUser();
            this.notify.success(response.message, 'Sessión Terminanda');
            this.router.navigate(['/site/home'])
        });
    }

    next(){
        var materialId:string = this.material._id;
        this.training.section.stages.forEach( (stage:IStage, stageIndex:number)=>{
            stage.materials.forEach( (material:IMaterial, materialIndex: number)=>{
                if( material._id == materialId ){
                    if( materialIndex < stage.materials.length - 1){
                        this.material = stage.materials[materialIndex + 1];
                    }else{
                        this.material = this.training.section.stages[stageIndex + 1 ].materials[0];
                    }
                    this.router.navigate([`/institute/${this.training_id}/material/${this.material._id}/show`]);
                    return;
                }
            });
        })
    }
    verify_stage(index: number){
        if(index == 0)
            return false;
            
        for( let c:number = 0; c < this.training.section.stages[index -1].materials.length; c++){
            let material:IMaterial = this.training.section.stages[index -1].materials[c];
            if(material.viewed == false)
                return true;
        } 
        for( let c:number = 0; c < this.training.section.stages[index -1].tests.length; c++){
            let test:ITest = this.training.section.stages[index -1].tests[c];
            if(!test.completed)
                return true;
        }
        return false;
    }

    verify_test(index: number){
        for( let c:number = 0; c < this.training.section.stages[index].materials.length; c++){
            let material:IMaterial = this.training.section.stages[index].materials[c];
            if(material.viewed == false)
                return true;
        }
        return false;
    }

    verify_material(si:number, index: number){
        if(index == 0 )
            return false;
        if(this.training.section.stages[si].materials && this.training.section.stages[si].materials.length > 0 && this.training.section.stages[si].materials[index - 1])
            return !this.training.section.stages[si].materials[index - 1].viewed;
        return true;
    }

    verify_enrollment(){
        let enrollment:any = Object.assign({}, this.enrollment);
        if(!this.enrollment 
                || enrollment.status != ENROLLMENT_STATUS_ENUM.subscribed 
                || this.training.section.status == SECTION_STATUS_ENUM.subcription )
            return;
        for( let si:number = 0; si < this.training.section.stages.length; si ++){
            let stage:IStage = this.training.section.stages[si];
            for( let ti:number = 0; ti < stage.tests.length; ti++){
                if(!stage.tests[ti].completed)
                    return;
            }
        }
        this.loadingService.show('');
        this.enrollmentService.complete(this.enrollment).subscribe(( response:IResponse) =>{
            this.loadingService.hide();
            if(response.result){
                this.notify.success(`Has finalizado el curso ${this.training.title} de manera satisfactoria.`, 'Curso');
                this.router.navigate([`/institute/${this.training.section._id}/home`]);
            }else{
                this.notify.error(`Error en el proceso de finalización de curso.`);
            }
        })
    }
}