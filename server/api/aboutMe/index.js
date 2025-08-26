import express from 'express';
import * as controller from './aboutMe.controller.js';
import {uploadAbout} from "../../middleware/upload.js";
import {requireAuth, requireAdmin} from "../../middleware/auth.js";

let router = express.Router();
const adminOnly = [requireAuth, requireAdmin];

// I always want to have an about me object and only one about me object, so there's only a GET and a PUT

// GET methods
router.get('/', controller.index);

// PUT method
router.put(
    '/', 
    ...adminOnly,
    uploadAbout.fields([
        {name: 'headshotFile', maxCount: 1},
        {name: 'resumeFile', maxCount:1}
    ]),
    controller.update);

export {router};