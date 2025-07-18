'use strict';

import {Project} from './projects.model.js';

export function index(req, res) {
    Project.find()
    .exec()
    .then(function(Projects){
        res.json({
            Projects
        });
    })
}

export function show(req, res) {
    Project.findById(req.params.id)
        .exec()
        .then(function(existingProject){
            if(existingProject){
                res.status(200);
                res.json(existingProject);
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
    let project = req.body;
    Project.create(project)
    .then(function(createdProject){
        res.status(201).json(createdProject);
    })
    .catch(function(err){
        res.status(400);
        res.send(err);
    })
}

export function update(req, res) {
    Project.findById(req.params.id)
        .exec()
        .then(function(existingProject) {
            if(existingProject) {
                existingProject.position = req.body.position;
                existingProject.company = req.body.company;
                existingProject.startDate = req.body.startDate;
                existingProject.endDate = req.body.endDate;
                existingProject.highlights = req.body.highlights;
                existingProject.skills = req.body.skills;

                return Promise.all([
                    existingProject.increment().save()
                ]);
            } else {
                return existingProject;
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
    Project.findById(req.params.id)
    .exec()
    .then(function(existingProject){
        if(existingProject) {
            return Promise.all([
                existingProject.deleteOne()
            ]);
        } else {
            return existingProject;
        }
    })
    .then(function(deletedProject){
        if(deletedProject){
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

