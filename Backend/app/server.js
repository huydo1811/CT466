import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; 

dotenv.config();

import connectDB from './config/db.js';
import countryRoutes from './routes/countryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import actorRoutes from './routes/actorRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import seriesRoutes from './routes/seriesRoutes.js';
import episodeRoutes from './routes/episodeRoute.js';
import reviewRoutes from './routes/reviewRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Kết nối database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://movie.huyquang.site'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    
    if (/\.(mp4|webm|mkv|mov)$/i.test(filePath)) {
      res.set('Accept-Ranges', 'bytes');
      res.set('Content-Type', 'video/mp4');
    }
  }
}));

app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes API
app.use('/api/countries', countryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/actors', actorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin', adminRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Movie Streaming API đang hoạt động',
    version: '1.0.0',
    endpoints: {
      countries: '/api/countries',
      categories: '/api/categories',
      actors: '/api/actors',
      users: '/api/users',
      auth: '/api/auth',
      banners: '/api/banners',
      movies: '/api/movies',
      episodes: '/api/episodes',
      reviews: '/api/reviews',
      series: '/api/series'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving uploads from: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`CORS enabled for: ${process.env.FRONTEND_URLS || 'http://localhost:5173'}`);
});

server.timeout = 600000; // 10 phút
server.keepAliveTimeout = 620000; // 10 phút 20 giây
server.headersTimeout = 630000; // 10 phút 30 giây

export default app;