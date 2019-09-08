import { Schema } from 'mongoose'

export const TrainingSchema = new Schema({
    title: String,
    description:String,
    media: {
        type: Schema.Types.ObjectId,
        ref: 'media',
        required: false
    },
    tags: {
        type: Array,
        item: String
    },
    publish_date: Date,
    language: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    is_free: Boolean,
    price: {
        type: Number,
        required: false
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
})