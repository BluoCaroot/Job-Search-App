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
