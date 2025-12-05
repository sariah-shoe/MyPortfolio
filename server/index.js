import "./config/env.js";
import startApp from "./app.js";

console.log("env loaded:", !!process.env.CLOUDINARY_CLOUD_NAME);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
let local = process.env.MONGODB_LOCAL ? (process.env.MONGODB_LOCAL == "true") : false;
let dbUrl = ""
let uri = ""
if(local){
    uri = process.env.MONGODB_URI;
    dbUrl = `mongodb://${uri}`;
} else {
    uri = process.env.MONGODB_ATLAS;
    let username = process.env.MONGODB_ATLAS_USERNAME;
    let password = process.env.MONGODB_ATLAS_PASSWORD;
    dbUrl = `mongodb+srv://${username}:${password}@${uri}`;
}
console.log(dbUrl);
startApp(port, dbUrl);