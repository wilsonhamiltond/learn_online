import { Schema } from 'mongoose'
export const ContactSchema = new Schema({
    name:String,
    email: String,
    text: String,
    create_date: Date,
    setting: {
        type: Schema.Types.ObjectId,
        ref: 'setting'
    }
})