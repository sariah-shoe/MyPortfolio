import startApp from "./app.js";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const dbUrl = process.env.DB_URL ? process.env.DB_URL : "localhost:27017/portfolio";
startApp(port, dbUrl)