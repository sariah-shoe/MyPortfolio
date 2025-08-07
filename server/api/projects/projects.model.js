import mongoose from "mongoose";
import { FileObject } from "../fileObject/fileObject.model.js"
let Schema = mongoose.Schema;

let projectSchema = Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true,
        maxlength: [100, "Project name cannot exceed 100 characters"]
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (v) {
                // Check that the end date is either null, undefined, or after the start date
                return !v || v >= this.startDate;
            },
            message: "End date must be after start date"
        }
    },
    images: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FileObject',
            validate: {
                validator: v => mongoose.Types.ObjectId.isValid(v),
                message: "Each image must have a valid ObjectId"
            }
        }],
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.length <= 10;
            },
            message: "You can attach up to 10 images only"
        },
        default: []
    },
    gitLink: {
        type: String,
        trim: true,
        maxlength: [300, "Github link is too long"],
        validate: {
            validator: function (v) {
                // Check that the link is either null or starts with https:// or http://
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: "GitHub link must be a valid url"
        }
    },
    replitLink: {
        type: String,
        trim: true,
        maxlength: [300, "Replit link is too long"],
        validate: {
            validator: function (v) {
                // Check that the link is either null or starts with https:// or http://
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: "Replit link must be a valid url"
        }
    },
    highlights: { 
        type: [String],
        default: [],
        validator: function (arr) {
            return Array.isArray(arr) && arr.every(item => typeof item === "string" && item.length <= 500 && arr.length <= 10);
        },
        message: "There can only be 10 highlights and each must be a string of 500 characters or fewer" 
    },
    skills: { 
        type: Array,
        default: [],
        validator: function (arr) {
            return Array.isArray(arr) && arr.every(item => typeof item === "string" && item.length <= 100 && arr.length <=10);
        },
        message: "There can only be 10 skills and each must be a string of 100 characters or fewer"
    },
    extra: { 
        type: String,
        trim: true,
        maxlength: [2000, "Extra section much be 2000 characters or fewer"],
        default: "" 
    }
});

projectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const project = this;
    try {
        await FileObject.deleteMany({ _id: { $in: project.images } });
        next();
    } catch (err) {
        next(err);
    }
});

let Project = mongoose.model('Project', projectSchema);
export { Project }