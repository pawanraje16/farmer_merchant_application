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
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
