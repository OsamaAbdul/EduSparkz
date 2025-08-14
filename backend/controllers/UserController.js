import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = {
  REGISTER: '1d',
  LOGIN: '2h'
};

// ===== Helper Validators =====
const validateRegisterInput = (email, password, username) => {
  if (!email || !password || !username) {
    throw new Error('Email, username, and password are required.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format.');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
};



const generateToken = (userId, expiry) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiry });
};

// ===== Register =====
export const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    validateRegisterInput(email, password, username);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
        error: 'Duplicate email',
      });
    };

    const existingUsername = await User.findOne({ username });

    if(existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken.',
        error: 'Duplicate username',
      });
    }; 

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ email, username, password: hashedPassword });

    const token = generateToken(user._id, TOKEN_EXPIRY.REGISTER);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: { id: user._id, email: user.email, name: user.username },
      error: null
    });

  } catch (error) {
    console.error('Register error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message || 'Internal server error',
    });
  }
};

// ===== Helper Validators =====
const validateLoginInput = (identifier, password) => {
  if (!identifier || !password) {
    throw new Error('Email/Username and password are required.');
  }
};

// ===== Login =====
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    validateLoginInput(identifier, password);

    // Check if identifier is email or username
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const user = await User.findOne(isEmail ? { email: identifier } : { username: identifier }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login failed.',
        error: 'Invalid credentials (user not found)',
      });
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
      user: {
        id: user._id,
        email: user.email,
        name: user.username,
      },
      error: null,
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to server error.',
      error: error.message || 'Internal server error',
    });
  }
};
