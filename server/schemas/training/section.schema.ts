import { Schema } from 'mongoose'

export const SectionSchema = new Schema({
    training: {
        type: Schema.Types.ObjectId,
        ref: 'training'
    },
    code: String,
    start_date: Date,
    end_date: Date,
    tutorial: {
        type: Boolean,
        default: true
    },
    percentage: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    status:  {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    create_date: Date,
    create_user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    setting:{
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
})