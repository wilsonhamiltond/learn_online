import { Schema } from 'mongoose'
export const PracticeSchema = new Schema({
    attacemnt: String,
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'stage'
    },
    name: String,
    description: String,
    order: Number,
    status: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    create_date:Date,
    create_user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }, 
    setting: {
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
}, { toJSON: { virtuals: true } } )

PracticeSchema.virtual('practiceresponse', {
    ref: 'practiceresponse',
    localField: '_id',
    foreignField: 'practice'
})
