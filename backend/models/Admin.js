import mongoose from 'mongoose';



// crearing the supervisor schema


const supervisorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: { type: String},
    otpExpires: { type: Date},
    isActive: {
        type: Boolean,default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// exporting the schema

export default mongoose.model('Supervisor', supervisorSchema);