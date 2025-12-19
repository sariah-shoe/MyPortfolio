// api/projects/projects.controller.js
'use strict';

import { Project } from './projects.model.js';
import { FileObject } from '../fileObject/fileObject.model.js';
import { uploadImages, deleteFromCloudinary } from '../../utils/cloudinaryFiles.js';
import { parseArray } from '../../utils/parseArray.js';
import mongoose from 'mongoose';

// GET /api/projects
export async function index(req, res) {
  try {
    const projects = await Project.find().populate('images');
    res.json({ projects });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}

// GET /api/projects/:id
export async function show(req, res) {
  try {
    const project = await Project.findById(req.params.id).populate('images');
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(project);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

// POST /api/projects
// Accepts optional initial uploads via multipart field "newImages"
export async function create(req, res) {
  try {
    // Accept existing image ObjectIds from the body
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
      uploadedIds = await uploadImages(req.files, 'portfolio/projects');
    }

    // Create project with merged images
    const payload = { ...req.body, images: [...existingIds, ...uploadedIds] };
    const created = await Project.create(payload);
    const populated = await Project.findById(created._id).populate('images');
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// PUT /api/projects/:id
// Accepts:
//   - files in field "newImages" (array)
//   - text field "deleteFileIds" (JSON array of FileObject _ids to remove)
export async function update(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    // Handle deletions (Cloudinary + DB + array)
    const rawDelete = req.body.deleteFileIds;
    const deleteFileIds = Array.isArray(rawDelete)
      ? rawDelete
      : (typeof rawDelete === "string" ? (() => { try { return JSON.parse(rawDelete) } catch { return [] } })() : []);

    if (deleteFileIds.length) {
      // Cast to ObjectId to avoid string-vs-ObjectId comparison headaches
      const oids = deleteFileIds.map(id => mongoose.Types.ObjectId.createFromHexString(id));

      // Find exact FileObjects so we can get public_id and type (pdf vs image)
      const toRemove = await FileObject.find({ _id: { $in: oids } }, "public_id type _id");

      // Best-effort Cloudinary deletion; never let one failure abort the rest
      await Promise.all(
        toRemove.map(f => {
          const resourceType = f.type === "pdf" ? "raw" : "image";
          return deleteFromCloudinary(f.public_id, resourceType, true).catch(err => {
            console.warn("Cloudinary destroy failed:", f.public_id, err?.message);
            return null;
          });
        })
      );

      // Remove the FileObject docs
      await FileObject.deleteMany({ _id: { $in: oids } });

      // pull all references from the project
      await Project.updateOne(
        { _id: req.params.id },
        { $pull: { images: { $in: [...oids, ...deleteFileIds] } } }
      );
    }

    // Check the count for my images
    const newCount = Array.isArray(req.files) ? req.files.length : 0;

    // If too many ids have been uploaded, throw error
    if (project.images.length + newCount > 10) {
      return res.status(400).json({ error: 'You can attach up to 10 images only' });
    }

    let uploadedIds = [];
    if (newCount) {
      uploadedIds = await uploadImages(req.files, 'portfolio/projects');
      project.images.push(...uploadedIds);
    }

    // Patch other fields if provided
    if (req.body.name !== undefined) project.name = req.body.name;
    if (req.body.startDate !== undefined) project.startDate = req.body.startDate;
    if (req.body.endDate !== undefined) project.endDate = req.body.endDate;
    if (req.body.gitLink !== undefined) project.gitLink = req.body.gitLink;
    if (req.body.replitLink !== undefined) project.replitLink = req.body.replitLink;
    if (req.body.highlights !== undefined) project.highlights = parseArray(req.body.highlights);
    if (req.body.skills !== undefined) project.skills = parseArray(req.body.skills);
    if (req.body.extra !== undefined) project.extra = req.body.extra;

    await project.save();
    const populated = await Project.findById(id).populate('images');
    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// DELETE /api/projects/:id
// Also deletes remote Cloudinary images
export async function destroy(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });

    // Get the files attached to my project
    const files = await FileObject.find({ _id: { $in: project.images } });

    // delete remote assets first (best-effort)
    await Promise.all(
      files.map(f => deleteFromCloudinary(f.public_id, 'image').catch(() => null))
    );

    // delete FileObjects
    await FileObject.deleteMany({ _id: { $in: project.images } });

    // delete project last
    await project.deleteOne();

    res.status(204).send();

  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
