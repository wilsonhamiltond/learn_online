import { Schema } from 'mongoose'
export const PracticeResponseSchema = new Schema({
    attachment: String,
    message: String,
    practice: {
        type: Schema.Types.ObjectId,
        ref: 'practice'
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
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
})