import { Schema } from 'mongoose'

export const EnrollmentSchema = new Schema({
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section'
    },
    person: {
        type: Schema.Types.ObjectId,
        ref: 'person'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    percentage: {
        type: Number,
        required: false
    },
    end_date: {
        type: Date,
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