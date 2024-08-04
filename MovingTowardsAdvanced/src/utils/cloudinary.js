// Note -> multer ke through hum koi bhi file ya image ko hum upload karate hain, and then uss file ya image ko hum 
// apne local server me rakhte hain and then hum uss file ya image ko cloudinary pe upload krate hain.

// Kayi baar hum directly file ko multer se upload karake cloudinary me store kara sakte hain, hum local server me store karane ki zaroorat nahi hai.

import {v2 as cloudinary} from "cloudinary";
import fs from "fs"  // fs helps in managing files in node.js 


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload the file on cloudinary...
        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto"
        })  // resource type is auto, means any file type ho sambhal lena.
        // file has been uploaded successfully...
        //console.log("file has been uploaded successfully", response.url);
        
        // fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed.
        return null;
    }
}

export {uploadOnCloudinary}