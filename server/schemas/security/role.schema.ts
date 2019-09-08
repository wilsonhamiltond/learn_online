import { Schema } from 'mongoose'
import { ModuleSchema } from './module.schema';
export const RoleSchema = new Schema({
    name: String,
    description: String,
    actived: Boolean,
    modules: {
        type: Array,
        item: ModuleSchema
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