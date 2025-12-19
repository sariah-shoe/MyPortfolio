// api/experiences/experiences.controller.js
'use strict';

import { Experience } from './experiences.model.js';
import { FileObject } from '../fileObject/fileObject.model.js';
import { deleteFromCloudinary, uploadImages } from '../../utils/cloudinaryFiles.js';
import { parseArray } from '../../utils/parseArray.js';

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
export async function create(req, res) {
  try {
    // Validate existing ids (if sent)
    const existingIds = Array.isArray(req.body.images)
      ? req.body.images
      : (req.body.images ? [req.body.images] : []);

    if (existingIds.length) {
      const valid = await FileObject.find({ _id: { $in: existingIds } });
      if (valid.length !== existingIds.length) {
        return res.status(400).json({ error: 'One or more image IDs are invalid' });
      }
    }

    // Check the count for my images
    const newCount = Array.isArray(req.files) ? req.files.length : 0;

    // If too many ids have been uploaded, throw error
    if (existingIds.length + newCount > 10) {
      return res.status(400).json({ error: 'You can attach up to 10 images only' });
    }

    let uploadedIds = [];
    if (newCount) {
      uploadedIds = await uploadImages(req.files, 'portfolio/experiences');
    }

    const payload = {
      ...req.body,
      images: [...existingIds, ...uploadedIds],
      highlights: parseArray(req.body.highlights),
      skills: parseArray(req.body.skills)
    };

    const created = await Experience.create(payload);
    const populated = await Experience.findById(created._id).populate('images');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
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
      await Promise.all(
        toRemove.map(f => deleteFromCloudinary(f.public_id, 'image').catch(() => null))
      );
      // Remove FileObjects
      await FileObject.deleteMany({ _id: { $in: deleteFileIds } });
      // Pull from the experience
      experience.images = experience.images.filter(id => !deleteFileIds.includes(String(id)));
    }

    // Check the count for my images
    const newCount = Array.isArray(req.files) ? req.files.length : 0;

    // If too many ids have been uploaded, throw error
    if (experience.images.length + newCount > 10) {
      return res.status(400).json({ error: 'You can attach up to 10 images only' });
    }

    let uploadedIds = [];
    if (newCount) {
      uploadedIds = await uploadImages(req.files, 'portfolio/experiences');
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

    // delete remote assets first (best-effort)
    await Promise.all(
      files.map(f => deleteFromCloudinary(f.public_id, 'image').catch(() => null))
    );

    // delete FileObjects
    await FileObject.deleteMany({ _id: { $in: experience.images } });

    // delete Experience last
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
