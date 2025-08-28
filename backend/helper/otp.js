import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';


// creating the agba transporter

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.gmail_user,
        pass: process.env.gmail_pass
    }
});

// create the function to generate the OTP
function generateOtp(){
    return(crypto.randomInt(100000, 1000000)).toString(); 
};

// create function to send the OTP to Email

async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: process.env.gmail_user,
        to: email,
        subject: 'Activation OTP',
        text: `Your account activation OTP code is ${otp} and will valid for just 10 minutes`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully, Check your email for the verification.');
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};


 