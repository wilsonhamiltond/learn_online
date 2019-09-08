
import { BaseModel } from '../base.model';
import { StageSchema } from '../../schemas/training/stage.schema';
import { TrainingSchema } from '../../schemas/training/training.schema';
import { SectionSchema } from '../../schemas/training/section.schema';
import { mongo } from 'mongoose';
import { ITraining } from '../../../src/models/training/training.model';
import { ISection } from '../../../src/models/training/section.model';
import { MaterialSchema } from '../../schemas/training/material.schema';
import { TestSchema } from '../../schemas/training/test.schema';
import { MediaSchema } from '../../schemas/training/media.schema';
import { EnrollmentSchema } from '../../schemas/training/enrollment.schema';
import { ENROLLMENT_STATUS_ENUM } from '../../../src/services/training/enrollment.service';
import { IEnrollment } from '../../../src/models/training/enrollment.model';

export class TrainingModel extends BaseModel {
    constructor() {
        super(TrainingSchema, 'training');
    }
    async portal(stage_id: string, media_id: string) {
        try {
            let stageModel = new BaseModel(StageSchema, 'stage'),
                sectionModel = new BaseModel(SectionSchema, 'section');
            let stage = await stageModel.get(stage_id);
            let section = await sectionModel.get(stage.section, true);
            let training = await this.get(section.training);
            training.media = new mongo.ObjectId(media_id);
            await this.update(training._id, training);
            return training;
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }

    async populars(query?: string) {
        try {
            let trainings = await this.filter({
                    $or: [
                        {
                            title: new RegExp(query, 'i'),
                        },{
                            tags: new RegExp(query, 'i')
                        }
                    ]
                }, {
                    _id: 1
                }),
                training_ids = trainings.map(( training:any) =>{
                    return training._id;
                }),
                sectionModel = new BaseModel(SectionSchema, 'section'),
                mediaModel = new BaseModel(MediaSchema, 'media'),
                enrollmentModel = new BaseModel(EnrollmentSchema, 'enrollment'),
                sections = await sectionModel.filter({
                    training: { $in: training_ids }
                }, {
                    code: 1,
                    author: { 
                        name: 1,
                        last_name: 1 
                    },
                    training: {
                        title: 1,
                        is_free: 1,
                        media: 1
                    }
                });
            for (let count = 0; count < sections.length; count++) {
                let section: any = sections[count];
                
                section['enrollments'] = await enrollmentModel.size({
                    section: section._id
                });
                section.training = await mediaModel.model.populate(section.training, {
                    path: 'media',
                    select: { url: 1, thumbnail: 1 }
                });
            }
            return sections;
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }

    async detials(_id: string, person_id?: string) {
        try {
            let stageModel = new BaseModel(StageSchema, 'stage'),
                sectionModel = new BaseModel(SectionSchema, 'section'),
                materialModel = new BaseModel(MaterialSchema, 'material'),
                enrollmentModel = new BaseModel(EnrollmentSchema, 'enrollment'),
                testModel = new BaseModel(TestSchema, 'test'),
                sections: ISection[] = await sectionModel.filter({
                    _id: _id
                },{
                    training: 1,
                    tutorial: 1,
                    status: 1,
                    author: {
                        name: 1,
                        last_name: 1,
                        email: 1,
                        summary: 1,
                        avatar_url: 1
                    }
                }),
                training: ITraining = await this.get(sections[0]['training'].toString(), true);

            training.section = sections[0];
            training.section.stages = await stageModel.filter({
                section: training.section._id
            }, {
                name: 1,
                start_date: 1,
                end_date: 1,
                status: 1
            });
            training.section['enrollments'] = await enrollmentModel.size({
                section: training.section._id
            });
            if(person_id){
                let enrollments: IEnrollment[] = await enrollmentModel.filter({
                    section: training.section._id,
                    person: person_id,
                    status: ENROLLMENT_STATUS_ENUM.subscribed
                }, {
                    _id: 1
                });
                if(enrollments.length > 0){
                    training.section['enrollment'] = enrollments[0]._id;
                }
            }
            for( let count = 0; count < training.section.stages.length; count ++ ){
                let params = {
                    stage: training.section.stages[count]._id
                };
                params['match'] = {
                    materialview: {
                        enrollment: training.section['enrollment'],
                        person: person_id
                    }
                }
                

                let materials = await materialModel.filter( params, {
                    name: 1,
                    order: 1,
                    media: {
                        duration: 1
                    },
                    type: {
                        description2: 1
                    },
                    materialview: {
                        _id: 1
                    }
                });

                materials = materials.map((material:any) =>{
                    material.viewed = material.materialview.length > 0
                    return material;
                })
                training.section.stages[count].materials = materials;
                delete  params['match'];
                params['match'] = {
                    questionresponse: {
                        enrollment: training.section['enrollment'],
                        person: person_id
                    }
                }
                let tests = await testModel.filter(params, {
                    questionresponse: {
                        _id: 1
                    },
                    question: {
                        _id: 1
                    },
                    name: 1
                });
                tests = tests.map( (test:any) =>{
                    test.completed = test.question.length == test.questionresponse.length;
                    return test;
                })
                training.section.stages[count].tests =tests;
            }

            return training;
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }
    
    async subscribed(section_id: string, person_id: string): Promise<boolean> {
        try {
            let enrollmentModel = new BaseModel(EnrollmentSchema, 'enrollment');
            let active_enrollments = await enrollmentModel.size({
                person: new mongo.ObjectID(person_id),
                section: new mongo.ObjectID( section_id ),
                status: new mongo.ObjectID( ENROLLMENT_STATUS_ENUM.subscribed)
            });
            return active_enrollments > 0;
        } catch (e) {
            console.log(e);
            return e.message;
        }
    }
}