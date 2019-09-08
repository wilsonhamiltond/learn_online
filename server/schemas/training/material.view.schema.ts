import { Schema } from 'mongoose'
export const MaterialViewSchema = new Schema({
    material: {
        type: Schema.Types.ObjectId,
        ref: 'material'
    },
    enrollment: {
        type: Schema.Types.ObjectId,
        ref: 'enrollment'
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