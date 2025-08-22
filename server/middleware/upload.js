// server/middleware/upload.js
import multer from "multer";

const storage = multer.memoryStorage();
const IMG_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const PDF_MIME = ["application/pdf"];

// Use this for Experiences/Projects (images only)
export const uploadImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (IMG_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type. Images only."), false);
  },
});

// Use this for AboutMe (headshot image OR resume pdf)
export const uploadAbout = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 2 },
  fileFilter: (req, file, cb) => {
    const isHeadshot = file.fieldname === "headshotFile";
    const isResume   = file.fieldname === "resumeFile";

    if (isHeadshot && IMG_MIME.includes(file.mimetype)) return cb(null, true);
    if (isResume && PDF_MIME.includes(file.mimetype))   return cb(null, true);

    return cb(new Error("Invalid file type for this field."), false);
  },
});
