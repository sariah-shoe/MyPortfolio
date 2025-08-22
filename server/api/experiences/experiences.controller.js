// api/experiences/experiences.controller.js
'use strict';

import { Experience } from './experiences.model.js';
import { FileObject } from '../fileObject/fileObject.model.js';
import { uploadImageBuffer, deleteFromCloudinary } from '../../utils/cloudinaryFiles.js'; // adjust path if needed

// small helper at top of controller file
function parseArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : []; } catch {}
  }
  return [];
}

// GET /api/experiences
export async function index(req, res) {
  try {
    const experiences = await Experience.find().populate('images');
    res.json({ experiences });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/experiences/:id
export async function show(req, res) {
  try {
    const experience = await Experience.findById(req.params.id).populate('images');
    if (!experience) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(experience);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/experiences
// Supports optional initial images via multipart field "newImages"
export async function create(req, res) {
  try {
    // Validate any existing image ids from body (optional)
    const existingIds = Array.isArray(req.body.images)
      ? req.body.images
      : (req.body.images ? [req.body.images] : []);
    if (existingIds.length) {
      const valid = await FileObject.find({ _id: { $in: existingIds } });
      if (valid.length !== existingIds.length) {
        return res.status(400).json({ error: 'One or more image IDs are invalid' });
      }
    }

    // Upload new images (if any)
    const uploadedIds = [];
    if (Array.isArray(req.files) && req.files.length) {
      for (const file of req.files) {
        const result = await uploadImageBuffer(file.buffer, { folder: 'portfolio/experiences' });
        const created = await FileObject.create({
          type: 'image',
          url: result.secure_url,
          public_id: result.public_id,
        });
        uploadedIds.push(created._id);
      }
    }

    // Enforce max 10 images total
    if (existingIds.length + uploadedIds.length > 10) {
      return res.status(400).json({ error: 'You can attach up to 10 images only' });
    }

    // Create experience with merged images
    const payload = { ...req.body, images: [...existingIds, ...uploadedIds] };
    if (req.body.highlights !== undefined) payload.highlights = parseArray(req.body.highlights);
    if (req.body.skills !== undefined) payload.skills = parseArray(req.body.skills);
    const created = await Experience.create(payload);
    const populated = await Experience.findById(created._id).populate('images');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// PUT /api/experiences/:id
// Accepts:
//   - files in field "newImages" (array)
//   - text field "deleteFileIds" (JSON array of FileObject _ids to remove)
export async function update(req, res) {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ message: 'Not Found' });

    // Optional deletions
    let deleteFileIds = [];
    if (req.body.deleteFileIds) {
      try {
        deleteFileIds = parseArray(req.body.deleteFileIds);
        if (!Array.isArray(deleteFileIds)) throw new Error('deleteFileIds must be an array');
      } catch {
        return res.status(400).json({ error: 'deleteFileIds must be valid JSON array' });
      }
    }

    if (deleteFileIds.length) {
      // Grab files to remove so we have public_ids
      const toRemove = await FileObject.find({ _id: { $in: deleteFileIds } });
      // Delete from Cloudinary first
      await Promise.all(toRemove.map(f => deleteFromCloudinary(f.public_id, 'image')));
      // Remove FileObjects
      await FileObject.deleteMany({ _id: { $in: deleteFileIds } });
      // Pull from the experience
      experience.images = experience.images.filter(id => !deleteFileIds.includes(String(id)));
    }

    // New uploads
    const uploadedIds = [];
    if (Array.isArray(req.files) && req.files.length) {
      for (const file of req.files) {
        const result = await uploadImageBuffer(file.buffer, { folder: 'portfolio/experiences' });
        const created = await FileObject.create({
          type: 'image',
          url: result.secure_url,
          public_id: result.public_id,
        });
        uploadedIds.push(created._id);
      }
    }

    // Enforce max 10 total images
    if (experience.images.length + uploadedIds.length > 10) {
      return res.status(400).json({ error: 'You can attach up to 10 images only' });
    }
    experience.images.push(...uploadedIds);

    // Patch scalar fields if provided
    if (req.body.typeEx !== undefined) experience.typeEx = req.body.typeEx;
    if (req.body.position !== undefined) experience.position = req.body.position;
    if (req.body.company !== undefined) experience.company = req.body.company;
    if (req.body.startDate !== undefined) experience.startDate = req.body.startDate;
    if (req.body.endDate !== undefined) experience.endDate = req.body.endDate;
    if (req.body.highlights !== undefined) experience.highlights = parseArray(req.body.highlights);
    if (req.body.skills !== undefined) experience.skills = parseArray(req.body.skills);
    if (req.body.extra !== undefined) experience.extra = req.body.extra;

    await experience.save();
    const populated = await Experience.findById(id).populate('images');
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /api/experiences/:id
// Also deletes remote Cloudinary images for this experience
export async function destroy(req, res) {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Not found' });

    // Fetch all file objects to get public_ids
    const files = await FileObject.find({ _id: { $in: experience.images } });
    // Best-effort remote deletion (do not fail whole request if a few assets are already gone)
    await Promise.all(files.map(f => deleteFromCloudinary(f.public_id, 'image').catch(() => null)));

    // Remove FileObjects then the Experience
    await FileObject.deleteMany({ _id: { $in: experience.images } });
    await experience.deleteOne();

    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
