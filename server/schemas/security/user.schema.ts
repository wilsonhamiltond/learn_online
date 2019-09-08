import { Schema } from 'mongoose'

export const UserSchema = new Schema({
    user_name: String,
    password: String,
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'role'
    }],
    status: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    type: String,
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    create_date: Date,
    create_user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    setting: {
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
})
