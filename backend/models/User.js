import mongoose from "mongoose";


// Schema

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    password: { type: String, required: true},
    otp: { type: String},
    otpExpires: { type: Date},
    isActive: {type: Boolean,default: false,}
});

// Model

export default mongoose.model('User', userSchema);