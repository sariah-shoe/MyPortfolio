'use strict';

import { Project } from './projects.model.js';

// Function to get all projects
export async function index(req, res) {
    try {
        const projects = await Project.find().populate("images");
        res.json({ projects });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}

// Function to get one project
export async function show(req, res) {
    try {
        const project = await Project.findById(req.params.id).populate('images');

        if (!project) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({ message: "Not Found" })
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

// Add a project
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

        const createdProject = await Project.create(req.body);
        res.status(201).json(createdProject);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

// Update a project
export async function update(req, res) {
    try {
        const project = await Project.findById({ message: "Not found" });

        if (!project) {
            return res.status(404).json({ message: "Not found" });
        }

        // Only update fields that are defined
        if (req.body.name !== undefined) project.name = req.body.name;
        if (req.body.startDate !== undefined) project.startDate = req.body.startDate;
        if (req.body.endDate !== undefined) project.endDate = req.body.endDate;
        if (req.body.images !== undefined) {
            // Check that my images are valid file objects
            const images = req.body.images;
            const validFiles = await FileObject.find({ _id: { $in: images } });
            if (validFiles.length !== images.length) {
                return res.status(400).json({ error: 'One or more image IDs are invalid' });
            }
            project.images = images;
        }
        if (req.body.gitLink !== undefined) project.gitLink = req.body.gitLink;
        if (req.body.replitLink !== undefined) project.replitLink = req.body.replitLink;
        if (req.body.highlights !== undefined) project.highlights = req.body.highlights;
        if (req.body.skills !== undefined) project.skills = req.body.skills;
        if (req.body.extra !== undefined) project.extra = req.body.extra;

        const saved = await project.save();
        res.status(200).json(saved);
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete a project
export async function destroy(req, res) {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Not found" });
        }

        await project.deleteOne()
        res.status(204).send();
    } catch (err) {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: 'Server error' });
    }
}

