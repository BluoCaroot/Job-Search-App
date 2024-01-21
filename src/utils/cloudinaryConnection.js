import { v2 as cloudinary } from "cloudinary"

export const cloudinaryConnection = () =>
{          
    cloudinary.config(
    { 
        cloud_name: 'dpfyjobms', 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });
    return cloudinary
}