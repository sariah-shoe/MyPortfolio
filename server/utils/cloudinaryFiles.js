// server/utils/cloudinaryFiles.js
import cloudinary from "../config/cloudinary.js";
import {FileObject} from "../api/fileObject/fileObject.model.js";

async function uploadImageBuffer(buffer, { folder = "portfolio" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function uploadPdfBuffer(buffer, { folder = "portfolio" } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw", format: "pdf" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

async function deleteFromCloudinary(public_id, resourceType = "image", invalidate = true) {
  return cloudinary.uploader.destroy(public_id, {
    resource_type: resourceType,
    invalidate,
  });
}

async function uploadImages(files, folder) {
  const uploadedIds = [];

  for (const file of files) {
    const result = await uploadImageBuffer(file.buffer, { folder });

    const created = await FileObject.create({
      type: "image",
      url: result.secure_url,
      public_id: result.public_id,
    });

    uploadedIds.push(created._id);
  }

  return uploadedIds;
}

export {
  uploadImageBuffer,
  uploadPdfBuffer,
  deleteFromCloudinary,
  uploadImages,
};
