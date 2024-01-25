import { cloudinaryConnection } from "./cloudinaryConnection.js"




export const upload = async (path, file) =>
{
    return await cloudinaryConnection().uploader.upload(file.path,
        {
            folder: path,
            use_filename: true,
            unique_filename: true
        })
    
}

export const remove = async (public_id) =>
{
    return await cloudinaryConnection().api.delete_resources(public_id)
}