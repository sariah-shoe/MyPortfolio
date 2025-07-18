'use strict';

import {Experience} from './experiences.model.js';

export function index(req, res) {
    Experience.find()
    .exec()
    .then(function(experiences){
        res.json({
            experiences
        });
    })
}

export function show(req, res) {
    Experience.findById(req.params.id)
        .exec()
        .then(function(existingExperience){
            if(existingExperience){
                res.status(200);
                res.json(existingExperience);
            } else {
                res.status(404);
                res.json({message: "Not Found"});
            }
        })
        .catch(function(err) {
            res.status(400);
            res.send(err);
        });
}

export function create(req, res) {
    let experience = req.body;
    Experience.create(experience)
    .then(function(createdExperience){
        res.status(201).json(createdExperience);
    })
    .catch(function(err){
        res.status(400);
        res.send(err);
    })
}

export function update(req, res) {
    Experience.findById(req.params.id)
        .exec()
        .then(function(existingExperience) {
            if(existingExperience) {
                existingExperience.position = req.body.position;
                existingExperience.company = req.body.company;
                existingExperience.startDate = req.body.startDate;
                existingExperience.endDate = req.body.endDate;
                existingExperience.highlights = req.body.highlights;
                existingExperience.skills = req.body.skills;

                return Promise.all([
                    existingExperience.increment().save()
                ]);
            } else {
                return existingExperience;
            }

        })
        .then(function(savedObjects){
            if(savedObjects){
                res.status(200);
                res.json(savedObjects[1]);
            } else {
                res.status(404);
                res.json({message: "Not found"});
            }
        })
        .catch(function(err){
            res.status(400);
            res.send(err);
        })
}

export function destroy(req, res) {
    Experience.findById(req.params.id)
    .exec()
    .then(function(existingExperience){
        if(existingExperience) {
            return Promise.all([
                existingExperience.deleteOne()
            ]);
        } else {
            return existingExperience;
        }
    })
    .then(function(deletedExperience){
        if(deletedExperience){
            res.status(204).send()
        } else {
            res.status(404);
            res.json({message: "Not Found"});
        }
    })
    .catch(function(err){
        res.status(400);
        res.send(err);
    })
}

