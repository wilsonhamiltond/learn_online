import { Schema } from 'mongoose'

export const StageSchema = new Schema({
    training: {
        type: Schema.Types.ObjectId,
        ref: 'training'
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section'
    },
    name: String,
    start_date: Date,
    end_date: Date,
    status:  {
        type: Schema.Types.ObjectId,
        ref: 'catalog'
    },
    create_date: Date,
    create_user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    setting:{
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
})