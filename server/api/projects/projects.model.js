import mongoose from "mongoose";
let Schema = mongoose.Schema;

let projectSchema = Schema({
    name: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }],
    link: {type: String},
    highlights: {type: Array},
    skills: {type: Array},
    extra: {type: String}
}); 

let Project = mongoose.model('Project', projectSchema);

export { Project }