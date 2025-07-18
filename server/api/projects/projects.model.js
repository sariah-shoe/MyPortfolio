import mongoose from "mongoose";
let Schema = mongoose.Schema;

let projectSchema = Schema({
    name: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    image: {type: String},
    link: {type: String},
    highlights: {type: Array},
    skills: {type: Array}
}); 

let Project = mongoose.model('Project', projectSchema);

export { Project }