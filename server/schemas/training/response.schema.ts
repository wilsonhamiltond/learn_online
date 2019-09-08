import { Schema } from 'mongoose'
export const ResponseSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'question'
    },
    options: {
        type: Array,
        item: Object
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