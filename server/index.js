import "./config/env.js";
import startApp from "./app.js";

console.log("env loaded:", !!process.env.CLOUDINARY_CLOUD_NAME);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const dbUrl = process.env.DB_URL ? process.env.DB_URL : "localhost:27017/portfolio";
startApp(port, dbUrl)