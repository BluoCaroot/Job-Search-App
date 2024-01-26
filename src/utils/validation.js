import { Types } from 'mongoose'
import Joi from 'joi'

export const objectId = (value) => 
{
    if (!Types.ObjectId.isValid(value))
    {
      throw new Error('invalid id')
    }
    return value;
}

export const skillsSchema = Joi.object(
{
    title: Joi.string(),
    experience: Joi.string().valid('Beginner', 'Intermediate', 'Skilled')
}).required()