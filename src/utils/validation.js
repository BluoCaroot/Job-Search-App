import { Types } from 'mongoose'


export const objectId = (value) => 
{
    if (!Types.ObjectId.isValid(value))
    {
      throw new Error('invalid id')
    }
    return value;
}
