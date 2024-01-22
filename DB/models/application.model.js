import { Schema, model } from "mongoose"
import { skillsSchema } from "./helper"

const applicationSchema = new Schema(
{
    jobId:
    {
        type: Schema.Types.ObjectId,
        ref: 'job',
        required: true
    },
    userId:
    {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userResume:
    {
        type: String,
        required: true
    }
}, {timestamps: true})

export default model('application', applicationSchema)