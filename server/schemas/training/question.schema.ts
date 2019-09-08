import { Schema } from 'mongoose'
export const QuestionSchema = new Schema({
    description: String,
    type: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    value: Number,
    status: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'test'
    },
    options: {
        type: Array,
        item: Object
    },
    responses:{
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