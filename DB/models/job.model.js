import { Schema, model } from "mongoose"
import { skillsSchema } from "./helper.js"

const jobSchema = new Schema(
{
    title:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        Enum: ['onsite', 'remote', 'hybrid'],
        required: true
    },
    workTime:
    {
        type: String,
        Enum: ['partTime', 'fullTime'],
        required: true
    },
    seniorityLevel:
    {
        type: String,
        Enum: ['junior', 'midLevel', 'Senior', 'teamLead', 'CTO'],
        required: true
    },
    techSkills: [skillsSchema],
    softSkills: [skillsSchema],
    addedBy:
    {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    company:
    {
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: true 
    }
}, {timestamps: true})

export default model('job', jobSchema)