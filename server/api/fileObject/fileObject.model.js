import mongoose from "mongoose";
let Schema = mongoose.Schema;

let fileObjectSchema = Schema({
    type: { type: String, enum: ['image', 'pdf'], required: true },
    url: {
        type: String,
        required: true,
        match: /^https?:\/\//
    }
    ,
    public_id: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

let FileObject = mongoose.model('FileObject', fileObjectSchema);

export { FileObject }