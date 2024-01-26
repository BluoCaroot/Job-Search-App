import { Schema } from "mongoose"


export const skillsSchema = new Schema(
{
    title:
    {
        type: String,
        required: true
    },
    experience:
    {
        type: String,
        Enum: ['Beginner', 'Intermediate', 'Skilled']
    }
})

export const resumeSchema = new Schema(
    {
        secure_url:
        {
            type: String,
            required: true
        },
        public_id:
        {
            type: String,
            required: true
        }
    })