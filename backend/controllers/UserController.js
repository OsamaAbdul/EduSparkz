// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

// ===== Config =====
const { JWT_SECRET, GMAIL_USER, GMAIL_PASS } = process.env;

if (!JWT_SECRET || !GMAIL_USER || !GMAIL_PASS) {
  throw new Error('Missing required environment variables: JWT_SECRET, GMAIL_USER, or GMAIL_PASS');
}

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = {
  REGISTER: '1d',
  LOGIN: '2h',
};

// ===== Nodemailer Setup =====
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS for port 465
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

// ===== Helpers =====
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function sendOTPEmail(to, subject, text) {
  const mailOptions = {
    from: `"EduSparkz" <${GMAIL_USER}>`,
    to,
    subject,
    text,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: 'Arial', 'Helvetica', sans-serif; background-color: #1a1a2e; color: #ffffff; }
          .container { max-width: 600px; margin: 20px auto; background-color: #2a2a3e; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }
          .header { background: linear-gradient(to right, #4A90E2, #00C4CC); padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; color: #ffffff; }
          .content { padding: 30px; text-align: center; }
          .content p { font-size: 16px; color: #d1d5db; line-height: 1.6; margin: 0 0 16px; }
          .otp { font-size: 32px; font-weight: bold; color: #ffffff; background: linear-gradient(to right, #4A90E2, #00C4CC); -webkit-background-clip: text; background-clip: text; color: transparent; margin: 20px 0; letter-spacing: 3px; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #4A90E2, #00C4CC); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; margin: 20px 0; }
          .button:hover { background: linear-gradient(to right, #5aa0f2, #10d4dc); }
          .footer { background-color: #1a1a2e; padding: 20px; text-align: center; font-size: 14px; color: #9ca3af; }
          .footer a { color: #4A90E2; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          @media only screen and (max-width: 600px) {
            .container { width: 90%; margin: 10px auto; }
            .header h1 { font-size: 24px; }
            .content { padding: 20px; }
            .otp { font-size: 28px; }
            .button { padding: 10px 20px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EduSparkz!</h1>
          </div>
          <div class="content">
            <p>Thank you for joining EduSparkz, your platform for personalized learning! To activate your account, use the One-Time Password (OTP) below:</p>
            <div class="otp">${text.split(' is ')[1].split('.')[0]}</div>
            <p>This OTP is valid for <b>10 minutes</b>. Enter it on the verification page to start your learning journey.</p>
            <p>If you didn’t request this, please ignore this email or <a href="https://yourapp.com/support">contact our support team</a>.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EduSparkz. All rights reserved.</p>
            <p>
              <a href="https://yourapp.com/support">Support</a> | 
              <a href="https://yourapp.com/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent via Nodemailer:', info.messageId);
    return info;
  } catch (error) {
    console.error('Nodemailer Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response,
    });
    throw error;
  }
}

function generateToken(userId, expiry) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiry });
}

function validateRegisterInput(email, password, username) {
  if (!email || !password || !username) {
    throw new Error('Email, username, and password are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format.');
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    throw new Error('Username must be 3-20 characters and contain only letters, numbers, or underscores.');
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}/.test(password)) {
    throw new Error('Password must include at least one uppercase letter, one lowercase letter, and one number.');
}
}

function validateLoginInput(identifier, password) {
  if (!identifier || !password) {
    throw new Error('Email/Username and password are required.');
  }
}

// ===== Controllers =====
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    validateRegisterInput(email, password, username);

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
        error: 'Duplicate email',
      });
    }
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken.',
        error: 'Duplicate username',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS); // Hash OTP
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpires,
      isActive: false,
    });

    try {
      await sendOTPEmail(email, 'Your EduSparkz Account Activation OTP', `Your EduSparkz account activation OTP is ${otp}. It is valid for 10 minutes.`);
    } catch (mailErr) {
      await User.deleteOne({ _id: user._id }); // Delete user on email failure
      return res.status(500).json({
        success: false,
        message: 'Registration failed due to email sending error.',
        error: mailErr.message || 'Email sending error',
      });
    }

    const token = generateToken(user._id, TOKEN_EXPIRY.REGISTER);

    return res.status(201).json({
      success: true,
      message: `Registration successful. An OTP has been sent to ${email}.`,
      token,
      user: { id: user._id, email: user.email, name: user.username, isActive: user.isActive },
      error: null,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message || 'Internal server error',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    validateLoginInput(identifier, password);

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    ).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login failed.',
        error: 'Invalid credentials (user not found)',
      });
    }

    if (!user.isActive) {
      const otp = generateOtp();
      const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      await user.save();

      try {
        await sendOTPEmail(
          user.email,
          'Your EduSparkz Account Activation OTP',
          `Your EduSparkz account activation OTP is ${otp}. It is valid for 10 minutes.`
        );
        return res.status(403).json({
          success: false,
          message: `Your account is not activated. An OTP has been sent to ${user.email}.`,
          error: 'Please activate your account to proceed. Redirecting you to verify OTP...',
        });
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP email.',
          error: emailError.message || 'Email sending error',
        });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Login failed.',
        error: 'Invalid credentials (wrong password)',
      });
    }

    const token = generateToken(user._id, TOKEN_EXPIRY.LOGIN);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user._id, email: user.email, name: user.username, isActive: user.isActive },
      error: null,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to server error.',
      error: error.message || 'Internal server error',
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Identifier and OTP are required.',
      });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "User doesn't exist with that identifier.",
      });
    }

    if (user.isActive) {
      return res.status(200).json({ 
        success: true,
        message: 'User is already activated.',
      });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid OTP.',
      });
    }

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP expired. Request a new one.',
      });
    }

    user.isActive = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: 'User activated successfully.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to verify OTP.',
      error: error.message || 'Internal server error',
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email is required.',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "User doesn't exist with that email.",
      });
    }

    if (user.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'User is already activated.',
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, 'Your EduSparkz Account Activation OTP', `Your EduSparkz account activation OTP is ${otp}. It is valid for 10 minutes.`);

    return res.status(200).json({ 
      success: true,
      message: 'OTP resent successfully.',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to resend OTP.',
      error: error.message || 'Internal server error',
    });
  }
};