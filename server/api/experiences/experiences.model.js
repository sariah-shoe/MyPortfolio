import mongoose from "mongoose";
import {FileObject} from "../fileObject/fileObject.model.js"
let Schema = mongoose.Schema;

let experienceSchema = Schema({
    typeEx: {
        type: String,
        required: [true, "typeEx is required"],
        enum: { values: ["Professional", "Education", "Personal"], message: "Type of experience must be on of: Professional, education, personal" }
    },
    position: {
        type: String,
        required: [true, "Position title is required"],
        trim: true,
        maxlength: [100, "Position title cannot exceed 100 characters."]
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters."],
        default: ""
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (v) {
                // Check that the date is either null, undefined, or greater than the start date
                return !v || v >= this.startDate;
            },
            message: "End date must be after start date"
        }
    },
    highlights: {
        type: [String],
        validate: {
            validator: function (arr) {
                // Check that highlights is an array of strings of 500 characters or fewer
                return Array.isArray(arr) && arr.every(item => typeof item === 'string' && item.length <= 500);
            },
            message: "Highlights must be an array of strings of 500 characters or fewer"
        },
        default: []
    },
    skills: {
        type: [String],
        validate: {
            validator: function (arr) {
                // Check that skills is an array of strings of 100 characters or fewer
                return Array.isArray(arr) && arr.every(item => typeof item === "string" && item.length <= 100);
            },
            message: "Each skill must be a string of 100 characters or fewer"
        },
        default: []
    },
    images: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FileObject',
            validate: {
                validator: v => mongoose.Types.ObjectId.isValid(v),
                message: "Each image must be a valid ObjectId"
            }
        }],
        validate: {
            validator: function (arr) {
                return Array.isArray(arr) && arr.length <= 10;
            },
            message: "You can attach up to 10 images only"
        }
    },
    extra: {
        type: String,
        trim: true,
        maxlength: [2000, 'Extra section must be 2000 characters or less'],
        default: ''
    }
});

// This makes use of pre middleware to delete the images and then delete the object
experienceSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const experience = this;
    await FileObject.deleteMany({ _id: { $in: experience.images } });
    next();
});

let Experience = mongoose.model('Experience', experienceSchema);

export { Experience }