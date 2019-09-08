import { Schema } from 'mongoose'
export const MaterialSchema = new Schema({
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'stage'
    },
    name: String,
    description: String,
    order: Number,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'media'
    },
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

MaterialSchema.virtual('materialview', {
    ref: 'materialview',
    localField: '_id',
    foreignField: 'material'
})
