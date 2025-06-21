// utils/cloudinaryUpload.js
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using stream (from memory).
 * @param {Buffer} buffer - File buffer from multer memory storage.
 * @param {string} mimetype - MIME type like image/jpeg or video/mp4.
 * @param {string} folder - Optional folder path like "avatars", "posts".
 * @returns {Promise<Object|null>} Cloudinary response or null.
 */
export const uploadOnCloudinary = (buffer, mimetype, folder = "") =>
  new Promise((resolve, reject) => {
    if (!buffer || !mimetype) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto", // auto-detect type (image/video/raw)
        folder,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });




export {uploadOnCloudinary}