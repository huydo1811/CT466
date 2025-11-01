import express from 'express';
import {
  getAllMovies,
  getMovieBySlug,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  togglePublishStatus,
  getFeaturedMovies,
  getLatestMovies,
  getHotMovies,
  incrementView,
  searchMovies,
  getMovieStats,
  getMoviesByCategory
} from '../controllers/movieController.js';
import { protect, authorize } from '../middleware/auth.js';

import multer from 'multer'
import fs from 'fs'
import path from 'path'

// ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'movies')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    cb(null, name)
  }
})
// allow large uploads (video)
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB
})

const router = express.Router();

// Public routes
router.get('/search', searchMovies);
router.get('/featured', getFeaturedMovies);
router.get('/latest', getLatestMovies);
router.get('/hot', getHotMovies);
router.get('/category/:categoryId', getMoviesByCategory);
router.get('/slug/:slug', getMovieBySlug);
router.post('/:id/view', incrementView);
router.get('/', getAllMovies);

// Protected routes - Admin only
router.use(protect, authorize('admin'));

// accept poster (image) and video (mp4) via multipart/form-data
router.post('/', upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), createMovie);
router.get('/admin/stats', getMovieStats);
router.get('/:id', getMovieById);
router.put('/:id', upload.fields([{ name: 'poster', maxCount: 1 }, { name: 'video', maxCount: 1 }]), updateMovie);
router.delete('/:id', deleteMovie);
router.patch('/:id/toggle', togglePublishStatus);

export default router;