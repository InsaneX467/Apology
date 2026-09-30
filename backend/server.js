import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import responseRoutes from './routes/responseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/apology_db';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS Configuration
app.use(cors({
  origin: [
    FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5187',
    'http://127.0.0.1:5187'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-secret'],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api', responseRoutes);

// Server Root Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Apology App API Server Running ❤️' });
});

// Database Connection & Listen
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection notice:', err.message);
    console.warn('Backend server running. Ensure local MongoDB service is started or set MONGODB_URI in .env');
  });

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
