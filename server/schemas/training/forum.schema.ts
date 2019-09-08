import { Schema } from 'mongoose'
export const ForumSchema = new Schema({
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

ForumSchema.virtual('message', {
    ref: 'message',
    localField: '_id',
    foreignField: 'forum'
})
