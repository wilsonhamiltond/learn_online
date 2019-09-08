import { Schema } from 'mongoose'
export const MessageSchema = new Schema({
    forum: {
        type: Schema.Types.ObjectId,
        ref: 'forum'
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    message: String,
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