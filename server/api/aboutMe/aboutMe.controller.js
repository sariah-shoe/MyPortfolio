'use strict';
import { AboutMe } from "./aboutMe.model.js";

// Function to grab the one AboutMe object
export async function index(req, res) {
    // In a try block to catch errors
    try {
        const aboutInfo = await AboutMe.findOne().populate(['headshot', 'resume']);
        if (!aboutInfo) {
            return res.status(404).json({ message: "About info not found" });
        }
        res.json({ aboutInfo })
        // Catch both user errors and server errors and return the correct response
    } catch (err) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            res.status(400).json({ error: err.message })
        }
        return res.status(500).json({ error: "Server error" });
    }
}

// A function to update my one AboutMe object and create it if it doesn't exist
export async function update(req, res) {
    // In a try block to catch errors
    try {
        // Search to see if my AboutMe object exists
        const existing = await AboutMe.findOne();

        // If it does exist, just do the update
        if (existing) {
            const updateFields = {};

            // Check to see what values the user sent to be updated
            if (req.body.headshot !== undefined) {
                const validFiles = await FileObject.find(req.body.headshot);
                if (!validFiles) {
                    return res.status(400).json({ error: "Image ID is invalid" })
                }
                updateFields.headshot = req.body.headshot;
            }
            if (req.body.blurb !== undefined) updateFields.blurb = req.body.blurb;
            if (req.body.resume !== undefined) {
                const validFiles = await FileObject.find(req.body.resume);
                if (!validFiles) {
                    return res.status(400).json({ error: "PDF ID is invalid" })
                }
                updateFields.resume = req.body.resume;
            }

            // Update the AboutMe with the values the user sent
            const updated = await AboutMe.findOneAndUpdate({}, updateFields, {
                new: true,
                runValidators: true
            });

            // Return the result
            return res.status(200).json(updated);
        } else {
            // Create a new document with my schema defaults
            const created = await AboutMe.create({
                headshot: req.body.headshot,
                blurb: req.body.blurb,
                resume: req.body.resume
            });

            // Return my created object
            return res.status(201).json(created);
        }
        // Catch user and server errors
    } catch (err) {
        if (err.name === "ValidationError" || err.name === "CastError") {
            res.status(400).json({ error: err.message })
        }
        return res.status(500).json({ error: "Server error" });
    }
}
