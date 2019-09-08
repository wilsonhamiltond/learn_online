import { Schema } from 'mongoose'
export const QuestionResponseSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'question'
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'test'
    },
    enrollment: {
        type: Schema.Types.ObjectId,
        ref: 'enrollment'
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    options: {
        type: Array,
        item: Object
    },
    restant_time: Number,
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