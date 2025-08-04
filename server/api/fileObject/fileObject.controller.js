'use strict';
import { FileObject } from "./fileObject.model.js";

export function index(req, res) {
    FileObject.find()
        .exec()
        .then(function (files) {
            res.json({
                files
            });
        })
}

export async function create(req, res) {
  try {
    const file = await FileObject.create({
      type: req.body.type,
      url: req.body.url,
      public_id: req.body.public_id,
    });
    res.status(201).json(file);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
