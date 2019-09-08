import { Schema } from 'mongoose'

export const SettingSchema = new Schema({
    name: String,
    description:{
        type:String,
        required: false
    },
    email: String,
    logo: String,
    latitude: Number,
    longitude: Number,
    zoon: Number
})
