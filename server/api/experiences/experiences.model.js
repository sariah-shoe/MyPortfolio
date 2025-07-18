import mongoose from "mongoose";
let Schema = mongoose.Schema;

let experienceSchema = Schema({
    position: {type: String},
    company: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    highlights: {type: Array},
    skills: {type: Array}
}); 

let Experience = mongoose.model('Experience', experienceSchema);

export{ Experience }