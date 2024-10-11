import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Remove the locally saved temporary file if the upload operation fails
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};


export default uploadOnCloudinary;
