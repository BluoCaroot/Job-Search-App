import * as cloudinary from './../utils/cloudinaryFunctions.js'


export const fileCleaner = async (err, req, res, next) =>
{
    if (err && req.userResume)
    {
        await cloudinary.remove(req.userResume.public_id)
    }
    if (err)
        next(err)
}