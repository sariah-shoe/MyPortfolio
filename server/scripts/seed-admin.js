import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "../api/users/user.model.js"

dotenv.config();

async function main() {
  // 1) Safety guard: forbid in production unless an explicit override is set
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_ADMIN_SEED !== "true") {
    throw new Error("Seeding disabled in production. Set ALLOW_ADMIN_SEED=true to override.");
  }

  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!uri || !email || !password) {
    throw new Error("Missing MONGODB_URI/ADMIN_EMAIL/ADMIN_PASSWORD in env.");
  }

  await mongoose.connect(`mongodb://${uri}`);

  // 2) If an admin already exists, bail out
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin already exists:", existingAdmin.email);
    await mongoose.disconnect();
    return;
  }

  // 3) Create admin
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, role: "admin" });
  console.log("Created admin:", user.email);

  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});