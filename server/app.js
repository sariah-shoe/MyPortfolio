import express from "express";
import registerRoutes from "./routes.js";
import mongoose from "mongoose";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";

export default (port, dbUrl) => {
    // Connect to MongoDB
    mongoose.connect(dbUrl)
        .then(() => {
            console.log('MongoDB connection successful, MongoDB available ');
        })
        .catch(err => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(-1);
        });

    // Create my app
    const app = express();

    // Disable fingerprinting
    app.disable('x-powered-by');

    // Middleware config
    app.use(helmet());
    app.use(express.json());
    app.use(cookieParser())
    app.use(cors({
        origin: process.env.NODE_ENV === 'production'
            ? ['https://sariahshoemaker.dev']
            : ['http://localhost:5173']
        ,
        credentials: true,
    }));

    // Mutler error handling
    app.use((err, _req, res, _next) => {
        if (err?.name === 'MulterError' || /Invalid file type/i.test(err?.message)) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected server error' });
    });

    // Register my routs
    registerRoutes(app);

    // Start listening
    app.listen(port, () => console.log(`App started on port ${port}`))

    return app;
}