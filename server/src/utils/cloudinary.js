// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary using stream.
 */
export const uploadOnCloudinary = (buffer, mimetype, folder = "") =>
  new Promise((resolve, reject) => {
    if (!buffer || !mimetype) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
        format: "jpg",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });

/**
 * Delete a file from Cloudinary using its URL
 * Extracts the public_id from the URL and deletes the resource
 */
export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.jpg
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) return null;

    // Get everything after 'upload/v123456/' or 'upload/'
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');

    // Remove file extension
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};

/**
 * Delete multiple files from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (imageUrls) => {
  try {
    if (!imageUrls || imageUrls.length === 0) return null;

    const deletePromises = imageUrls.map(url => deleteFromCloudinary(url));
    const results = await Promise.all(deletePromises);

    return results;
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary:", error);
    return null;
  }
};
