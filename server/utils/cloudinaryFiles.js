// server/utils/cloudinaryFiles.js
import cloudinary from "../config/cloudinary.js";

export async function uploadImageBuffer(buffer, { folder = "portfolio" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function uploadPdfBuffer(buffer, { folder = "portfolio" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw", format: "pdf" }, // ensure it's stored as raw/PDF
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(public_id, resourceType = "image", invalidate = true) {
  return cloudinary.uploader.destroy(public_id, { resource_type: resourceType, invalidate });
}
