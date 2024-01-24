import { cloudinaryConnection } from "./cloudinaryConnection"




export const upload = async (file) =>
{
    return await cloudinaryConnection().uploader.upload(file.path,
        {
            folder: `uploads/${jobId}/applications/`,
            use_filename: true,
            unique_filename: true
        })
    
}

export const remove = async (public_id) =>
{
    return await cloudinaryConnection().api.delete_resources(public_id)
}