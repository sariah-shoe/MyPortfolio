'use strict';

import { FileObject } from '../fileObject/fileObject.model.js';
import { Experience } from './experiences.model.js';

// Function to get all the experiences
export async function index(req, res) {
    try {
        const experiences = await Experience.find().populate('images');
        res.json({ experiences });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

// Function to get one experience with its Id
export async function show(req, res) {
    try {
        const experience = await Experience.findById(req.params.id).populate('images');
        if (!experience) {
            return res.status(404).json({ message: "Not found" })
        }
        res.status(200).json(experience);
    } catch (err) {
        if (err.name === "CastError" || err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
}

// Function to create an experience
export async function create(req, res) {
    try {
        // Pull images out of the body so we can do validation
        const { images = [] } = req.body;

        // Check if the ID actually points to a fileObject
        if (images.length > 0) {
            const validFiles = await FileObject.find({ _id: { $in: images } });
            if (validFiles.length !== images.length) {
                return res.status(400).json({ error: "One or more image IDs are invalid" });
            }
        }
        const createdExperience = await Experience.create(req.body);
        res.status(201).json(createdExperience);
    } catch (err) {
        if (err.name === "CastError" || err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
}

// Function to update an experience
export async function update(req, res) {
    try {
        const experience = await Experience.findById(req.params.id);

        // I return a 404 message instead of creating the resource because my backend controls the IDs and I don't want my frontend making them
        if (!experience) {
            return res.status(404).json({ message: "Not Found" })
        }

        // Only update fields if provided
        if (req.body.typeEx !== undefined) experience.typeEx = req.body.typeEx;
        if (req.body.position !== undefined) experience.position = req.body.position;
        if (req.body.company !== undefined) experience.company = req.body.company;
        if (req.body.startDate !== undefined) experience.startDate = req.body.startDate;
        if (req.body.endDate !== undefined) experience.endDate = req.body.endDate;
        if (req.body.highlights !== undefined) experience.highlights = req.body.highlights;
        if (req.body.skills !== undefined) experience.skills = req.body.skills;
        if (req.body.images !== undefined) {
            // Check that my images are valid file objects
            const images = req.body.images;
            const validFiles = await FileObject.find({ _id: { $in: images } });
            if (validFiles.length !== images.length) {
                return res.status(400).json({ error: 'One or more image IDs are invalid' });
            }
            experience.images = images;
        }
        if (req.body.extra !== undefined) experience.extra = req.body.extra;

        // Save and return the object
        const saved = await experience.save();
        res.status(200).json(saved);

    } catch (err) {
        if (err.name === "CastError" || err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
}

// Delete an experience
export async function destroy(req, res) {
    try {
        // Look for the object and return 404 if it isn't found
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: "Not found" });
        }

        await experience.deleteOne();
        res.status(204).send();
    } catch (err) {
        if (err.name === "CastError" || err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Server error" });
    }
}

