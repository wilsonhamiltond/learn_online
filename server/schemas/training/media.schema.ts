import { Schema } from 'mongoose'
export const MediaSchema = new Schema({
    name: String,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    url: String,
    thumbnail: String,
    duration: Number,
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