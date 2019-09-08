import { Schema } from 'mongoose'
export const TestSchema = new Schema({
    name: String,
    description: String,
    time: Number,
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'stage'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    create_date: Date,
    create_user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    setting: {
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
}, { toJSON: { virtuals: true } } )

TestSchema.virtual('question', {
    ref: 'question',
    localField: '_id',
    foreignField: 'test'
})

TestSchema.virtual('questionresponse', {
    ref: 'questionresponse',
    localField: '_id',
    foreignField: 'test'
})
