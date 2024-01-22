import { Schema, model } from "mongoose"
import { skillsSchema } from "./helper.js"

const userSchema = new Schema(
{
    firstName:
    {
        type: String,
        required: true,
        trim: true
    },
    lastName:
    {
        type: String,
        required: true,
        trim: true
    },
    userName:
    {
        type: String
    },
    email:
    {
        required: true,
        unique: true,
        type: String,
        lowercase: true,
        trim: true
    },
    password:
    {
        required: true,
        type: String
    },
    recoveryEmail:
    {
        type: String,
        lowercase: true, 
        trim: true
    },
    dateOfBirth: String,
    phoneNumber:
    {
        type: String,
        required: true,
        unique: true
    },
    role:
    {
        type: String,
        Enum: ['user', 'hr'],
        required: true
    },
    status:
    {
        type: String,
        Enum: ['online', 'offline'],
        default: 'offline'
    },
    techSkills: [skillsSchema],
    softSkills: [skillsSchema]
}, {timestamps: true})


export default model('user', userSchema)