import { Schema } from 'mongoose'
export const CatalogSchema = new Schema({
    name:String,
    group: String,
    order: Number,
    description: {
        type: String,
        required: false
    },
    description2: {
        type: String,
        required: false
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