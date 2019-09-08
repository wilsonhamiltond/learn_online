import { Schema } from 'mongoose'
export const PersonSchema = new Schema({
    name: String,
    last_name:  {
        type: String,
        required: false
    },
    email: String,
    avatar_url:  {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    birthdate:  {
        type: Date,
        required: false
    },
    summary:  {
        type: String,
        required: false
    },
    document_type:  {
        type: String,
        required: false
    },
    document_number:  {
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