import { Schema, model } from "mongoose"

import { skillsSchema , resumeSchema } from "./helper.js"




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
    userResume: resumeSchema,
    techSkills: [skillsSchema],
    softSkills: [skillsSchema]
}, {timestamps: true})

export default model('application', applicationSchema)