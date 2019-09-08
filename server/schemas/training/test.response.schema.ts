import { Schema } from 'mongoose'
export const TestResponseSchema = new Schema({
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: 'test'
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