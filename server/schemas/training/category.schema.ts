import { Schema } from 'mongoose'

export const CategorySchema = new Schema({
    name: String,
    description: String,
    parent_category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
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