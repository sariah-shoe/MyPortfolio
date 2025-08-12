'use strict';
import { AboutMe } from "./aboutMe.model.js";
import { FileObject } from "../fileObject/fileObject.model.js";
import mongoose from "mongoose";

// Function to grab the one AboutMe object
export async function index(req, res) {
    // In a try block to catch errors
    try {
        const aboutInfo = await AboutMe.findOne().populate(['headshot', 'resume']);
        if (!aboutInfo) {
            return res.status(404).json({ message: "About info not found" });
        }
        res.json(aboutInfo);
        // Catch both user errors and server errors and return the correct response
    } catch (err) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            res.status(400).json({ error: err.message })
        }
        return res.status(500).json({ error: "Server error" });
    }
}
// helper: ignore empty strings; allow null explicitly
const normalizeIdInput = (v) => (v === '' ? undefined : v);

const ensureFile = async (id, expectedType) => {
  if (id === null) return { id: null };            // explicit clear
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: `Invalid ObjectId: ${id}` };
  }
  const doc = await FileObject.findById(id).lean(); // existence check
  if (!doc) return { error: `FileObject not found: ${id}` };
  if (expectedType && doc.type !== expectedType) {
    return { error: `FileObject ${id} must be type "${expectedType}", got "${doc.type}"` };
  }
  return { id };
};

export async function update(req, res) {
  try {
    const existing = await AboutMe.findOne();

    // normalize incoming values: '' -> undefined (no change)
    const headshotIn = normalizeIdInput(req.body.headshot);
    const blurbIn = req.body.blurb; // strings can be '' intentionally
    const resumeIn = normalizeIdInput(req.body.resume);

    if (existing) {
      const updateFields = {};

      if (headshotIn !== undefined) {
        const ok = await ensureFile(headshotIn, 'image');
        if (ok.error) return res.status(400).json({ error: ok.error });
        updateFields.headshot = ok.id; // may be null to clear
      }

      if (blurbIn !== undefined) {
        updateFields.blurb = blurbIn;
      }

      if (resumeIn !== undefined) {
        const ok = await ensureFile(resumeIn, 'pdf');
        if (ok.error) return res.status(400).json({ error: ok.error });
        updateFields.resume = ok.id; // may be null to clear
      }

      const updated = await AboutMe.findOneAndUpdate({}, updateFields, {
        new: true,
        runValidators: true,
      }).populate(['headshot', 'resume']);
      return res.status(200).json(updated);
    }

    // create path: allow schema defaults to fill missing fields
    const createData = {};
    if (headshotIn !== undefined) {
      const ok = await ensureFile(headshotIn, 'image');
      if (ok.error) return res.status(400).json({ error: ok.error });
      createData.headshot = ok.id;
    }
    if (blurbIn !== undefined) createData.blurb = blurbIn;
    if (resumeIn !== undefined) {
      const ok = await ensureFile(resumeIn, 'pdf');
      if (ok.error) return res.status(400).json({ error: ok.error });
      createData.resume = ok.id;
    }

    const created = await AboutMe.create(createData);
    const populated = await AboutMe.findById(created._id).populate(['headshot', 'resume']);
    return res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}