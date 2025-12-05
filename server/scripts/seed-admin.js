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

  let uri = ""
  let dbUrl = ""
  if (process.env.MONGODB_LOCAL == "true") {
    uri = process.env.MONGODB_URI;
    dbUrl = `mongodb://${uri}`;
  } else {
    uri = process.env.MONGODB_ATLAS;
    let username = process.env.MONGODB_ATLAS_USERNAME;
    let password = process.env.MONGODB_ATLAS_PASSWORD;
    dbUrl = `mongodb+srv://${username}:${password}@${uri}`;
  }
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!dbUrl || !email || !password) {
    throw new Error("Missing MONGODB_URI/ADMIN_EMAIL/ADMIN_PASSWORD in env.");
  }

  await mongoose.connect(dbUrl);

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
  try { await mongoose.disconnect(); } catch { }
  process.exit(1);
});