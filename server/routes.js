import * as experiences from './api/experiences/index.js'
import * as projects from './api/projects/index.js'
import * as aboutMe from './api/aboutMe/index.js'
import path from 'path'
import express from 'express'

export default (app) => {
    app.use(express.static("public"));
    app.use('/api/experiences', experiences.router);
    app.use('/api/projects', projects.router);
    app.use('/api/aboutMe', aboutMe.router);
    app.use("/{*splat}", (req, res) => {
        res.sendFile(path.resolve(`public/index.html`));
    });
}