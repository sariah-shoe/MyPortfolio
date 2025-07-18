import express from "express";
import registerRoutes from "./routes.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';

export default (port, dbUrl) => {
    mongoose.connect(`mongodb://${dbUrl}`)
    .then(() => {
        console.log('MongoDB connection successful, MongoDB available ');
    })
    .catch(err => {
        console.error(`MongoDB connection error: ${err}`);
        process.exit(-1);
    });
    const app = express();
    app.use(cors());
    app.listen(port, () => console.log(`App started on port ${port}`))
    app.use(bodyParser.json());
    registerRoutes(app);
    return app;
}