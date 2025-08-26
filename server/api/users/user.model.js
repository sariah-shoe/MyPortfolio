import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: { 
        type: String, 
        role: {enum: ["admin, viewer"]}, 
        default: "viewer"
    },
}, { timestamps: true })

UserSchema.methods.verifyPassword = function (pw) {
    return bcrypt.compare(pw, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);
export { User }