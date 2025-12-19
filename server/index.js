import "./config/env.js";
import startApp from "./app.js";

// If I'm in dev, double check that my .env loaded sucessfully
if (process.env.NODE_ENV !== 'production') {
  console.log("env loaded:", !!process.env.CLOUDINARY_CLOUD_NAME);
}

// Set port and whether my database is local
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const local = process.env.MONGODB_LOCAL ? (process.env.MONGODB_LOCAL == "true") : false;

// Set my dbUrl and uri depending on whether I'm using atlas or localdb
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
console.log("Database configured:", local ? "local" : "atlas");

// Start the app with my port and database
startApp(port, dbUrl);