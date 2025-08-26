import express from 'express';
import * as controller from './experiences.controller.js';
import {uploadImages} from "../../middleware/upload.js";
import {requireAuth, requireAdmin} from "../../middleware/auth.js";

const router = express.Router();
const adminOnly = [requireAuth, requireAdmin];

// GET methods
router.get('/', controller.index);
router.get('/:id', controller.show);

// POST method
router.post(
    '/', 
    ...adminOnly,
    uploadImages.array('newImages', 10), 
    controller.create
);

// PUT method
router.put(
    '/:id', 
    ...adminOnly,
    uploadImages.array('newImages', 10), 
    controller.update
);

// DELETE method
router.delete(
    '/:id', 
    ...adminOnly,
    controller.destroy
);

export {router};