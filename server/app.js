import express from "express";
import registerRoutes from "./routes.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";

export default (port, dbUrl) => {
    mongoose.connect(dbUrl)
        .then(() => {
            console.log('MongoDB connection successful, MongoDB available ');
        })
        .catch(err => {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(-1);
        });
    const app = express();
    app.use(helmet());
    app.use(express.json());
    app.use(cookieParser())
    app.use(cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    }));
    app.listen(port, () => console.log(`App started on port ${port}`))
    app.use(bodyParser.json());
    app.use((err, _req, res, _next) => {
        if (err?.name === 'MulterError' || /Invalid file type/i.test(err?.message)) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Unexpected server error' });
    });

    registerRoutes(app);
    return app;
}