import mongoose from 'mongoose';



const studentSchema = new mongoose.Schema({
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
    nameOfSchool: {
        type: String,
        required: true,
        
    },
    otp: { 
        type: String
    },
    otpExpires: { 
        type: Date
    },
    isActive: {
        type: Boolean,default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model('Student', studentSchema);