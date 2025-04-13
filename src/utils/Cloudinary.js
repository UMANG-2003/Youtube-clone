import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = async (localFilePath) => {
    try{
        if(!localFilePath) throw new Error('No file path provided');
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });
        console.log("file uploaded to cloudinary", result);
        return result;
    }catch (error) {
        fs.unlinkSync(localFilePath); 
        return null;
    }
}

export default upload;