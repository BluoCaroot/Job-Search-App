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

const resumeSchema = new Schema(
    {
        secure_url:
        {
            type: string,
            required: true
        },
        public_id:
        {
            type: string,
            required: true
        }
    })