// api/aboutMe/aboutMe.controller.js
'use strict';

import { AboutMe } from './aboutMe.model.js';
import { FileObject } from '../fileObject/fileObject.model.js'; // adjust path if your fileObject lives elsewhere
import { uploadImageBuffer, uploadPdfBuffer, deleteFromCloudinary } from '../../utils/cloudinaryFiles.js'; // adjust path if needed

// GET /api/aboutMe
export async function index(req, res) {
  try {
    const aboutInfo = await AboutMe.findOne().populate(['headshot', 'resume']);
    if (!aboutInfo) return res.status(404).json({ message: 'About info not found' });
    return res.json(aboutInfo);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Server error' });
  }
}

// PUT /api/aboutMe
// Expects multipart/form-data with optional fields:
//  - headshotFile: image/* (single file)
//  - resumeFile: application/pdf (single file)
//  - deleteHeadshot: "true" to remove current headshot
//  - deleteResume:  "true" to remove current resume
//  - blurb: string
export async function update(req, res) {
  try {
    let about = await AboutMe.findOne();
    if (!about) {
      // create the singleton if missing so we can mutate it below
      about = await AboutMe.create({});
    }

    // 1) Blurb (plain text)
    if (req.body.blurb !== undefined) {
      about.blurb = req.body.blurb;
    }

    // 2) Headshot delete (if requested)
    if (req.body.deleteHeadshot === 'true' && about.headshot) {
      const old = await FileObject.findById(about.headshot);
      if (old) {
        await deleteFromCloudinary(old.public_id, 'image').catch(() => null);
        await FileObject.deleteOne({ _id: old._id });
      }
      about.headshot = null;
    }

    // 3) Resume delete (if requested)
    if (req.body.deleteResume === 'true' && about.resume) {
      const old = await FileObject.findById(about.resume);
      if (old) {
        await deleteFromCloudinary(old.public_id, 'raw').catch(() => null); // PDFs are stored as "raw"
        await FileObject.deleteOne({ _id: old._id });
      }
      about.resume = null;
    }

    // 4) Headshot upload/replace (image)
    const headshotFile = req.files?.headshotFile?.[0];
    if (headshotFile) {
      // remove existing, if any
      if (about.headshot) {
        const old = await FileObject.findById(about.headshot);
        if (old) {
          await deleteFromCloudinary(old.public_id, 'image').catch(() => null);
          await FileObject.deleteOne({ _id: old._id });
        }
      }
      // upload new
      const up = await uploadImageBuffer(headshotFile.buffer, { folder: 'portfolio/about' });
      const created = await FileObject.create({
        type: 'image',
        url: up.secure_url,
        public_id: up.public_id,
      });
      about.headshot = created._id;
    }

    // 5) Resume upload/replace (PDF)
    const resumeFile = req.files?.resumeFile?.[0];
    if (resumeFile) {
      // remove existing, if any
      if (about.resume) {
        const old = await FileObject.findById(about.resume);
        if (old) {
          await deleteFromCloudinary(old.public_id, 'raw').catch(() => null);
          await FileObject.deleteOne({ _id: old._id });
        }
      }
      // upload new (store as raw/pdf)
      const up = await uploadPdfBuffer(resumeFile.buffer, { folder: 'portfolio/about' });
      const created = await FileObject.create({
        type: 'pdf',
        url: up.secure_url,
        public_id: up.public_id,
      });
      about.resume = created._id;
    }

    await about.save();
    const populated = await AboutMe.findById(about._id).populate(['headshot', 'resume']);
    return res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
