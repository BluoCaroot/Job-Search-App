import { Schema, model } from "mongoose"


const companySchema = new Schema(
{
    name:
    {
        type: String,
        required: true,
        unique: true
    },
    description:
    {
        type: String,
        required: true
    },
    industry:
    {
        type: String,
        required: true
    },
    address:
    {
        type: String,
        required: true
    },
    companySize:
    {
        type: String,
        Enum: ["less than 10", "11-20", "21-50", "50+"],
        required: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hr:
    {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true})

export default model('company', companySchema)