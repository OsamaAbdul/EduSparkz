import express from 'express';
import cors from 'cors';
import routes from './routes/quizRoutes.js';
import dotenv from 'dotenv';
import job from './config/cron.js'
import authRoutes from './routes/authRoutes.js';
import connectToDb from './config/db.js';
import fileUpload  from 'express-fileupload';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// only if in production mode
if(process.env.NODE_ENV ==="development") job.start();

// === frontend url ===

const frontendUrl = process.env.FRONTEND_URL;
// ✅ Define allowed origins without trailing slashes
const allowedOrigins = [frontendUrl];

// ✅ Define corsOptions
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// ✅ Apply CORS once with the correct options
app.use(cors(corsOptions));
app.use(fileUpload());

// ✅ Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('public')); 

// ✅ DB Connection
  connectToDb()

// ✅ Routes
app.use('/api/user', routes);
app.use('/api/user/auth/', authRoutes);

// Route to check server

app.get('/server-check', (req, res) => {
    res.status(200).json({ message: "Server up and running.........."})
})

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
