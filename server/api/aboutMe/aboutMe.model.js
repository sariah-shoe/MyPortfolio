import mongoose from "mongoose";

let Schema = mongoose.Schema;

let aboutMeSchema = Schema({
    headshot: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FileObject', 
        default: null,
        // This checks that the ObjectId in the schema is a valid Id or null
        validate: {
            validator: function (v) {
                return v === null || mongoose.Types.ObjectId.isValid(v);
            },
            message: "Headshot must be a valid ObjectId or null",
        },
    },

    blurb: {
        type: String, 
        default: "",
        maxlength: [1000, "Blurb cannot exceed 1000 characters"],
        trim: true,
        validate: {
            // Check that my blurb is a string and that it isn't just whitespace or its the default empty string
            validator: function(v){
                return typeof v === 'string' && v.trim().length > 0 || v === "";
            },
            message: "Blurb must be a non-empty string or left blank",
        }
    },

    resume: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FileObject', 
        default:null,
        validate: {
            // This checks that the ObjectId in the schema is a valid Id or null
            validator: function (v) {
                return v === null || mongoose.Types.ObjectId.isValid(v);
            },
            message: "Resume must be a valid ObjectId or null",
        }
    },
});

let AboutMe = mongoose.model('AboutMe', aboutMeSchema);

export { AboutMe }