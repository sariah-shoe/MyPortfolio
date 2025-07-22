import mongoose from "mongoose";
let Schema = mongoose.Schema;

let experienceSchema = Schema({
    typeEx: {type: String},
    position: {type: String},
    company: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    highlights: {type: Array},
    skills: {type: Array},
    // This is acheived using GridFs, look more into how to acheive this when connecting backend
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }],
    // This is for any personal blurbs or statements I want to make about the experience
    extra: {type: String}
}); 

let Experience = mongoose.model('Experience', experienceSchema);

export{ Experience }