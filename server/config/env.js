import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Always load /server/.env explicitly
dotenv.config({ path: path.join(__dirname, "../.env") });

// Optional sanity check (don’t log secrets)
for (const k of ["CLOUDINARY_CLOUD_NAME","CLOUDINARY_API_KEY","CLOUDINARY_API_SECRET"]) {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
}
