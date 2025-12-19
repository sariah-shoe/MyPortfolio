import {router as experiencesRouter} from './api/experiences/index.js'
import {router as projectsRouter} from './api/projects/index.js'
import {router as aboutMeRouter} from './api/aboutMe/index.js'
import {router as authRouter} from './api/auth/index.js'
import {router as contactRouter} from './api/contact/index.js'
import path from 'path'
import express from 'express'

export default (app) => {
    // Public
    app.use(express.static("public"));

    // API routers
    app.use('/api/auth', authRouter);
    app.use('/api/experiences', experiencesRouter);
    app.use('/api/projects', projectsRouter);
    app.use('/api/aboutMe', aboutMeRouter);
    app.use('/api/contact', contactRouter);

    // Catch-all
    app.use("/{*splat}", (req, res) => {
        res.sendFile(path.resolve(`public/index.html`));
    });
}