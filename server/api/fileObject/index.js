import express from 'express';
import * as controller from './fileObject.controller.js';

let router = express.Router();

// GET methods
router.get('/', controller.index);

// POST method
router.post('/', controller.create);

export {router};