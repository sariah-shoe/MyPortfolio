import express from 'express';
import * as controller from './projects.controller.js';
import {uploadImages} from '../../middleware/upload.js';

let router = express.Router();

// GET methods
router.get('/', controller.index);
router.get('/:id', controller.show);

// POST method
router.post('/', uploadImages.array('newImages', 10), controller.create);

// PUT method
router.put('/:id', uploadImages.array('newImages', 10), controller.update);

// DELETE method
router.delete('/:id', controller.destroy);

export {router};