import express from 'express';
import {
  getEpisodesByMovie,
  getEpisodeBySlug,
  incrementEpisodeView,
  createEpisode,
  getEpisodeById,
  updateEpisode,
  deleteEpisode
} from '../controllers/episodeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/movie/:movieId', getEpisodesByMovie);      // Lấy episodes của series
router.get('/slug/:slug', getEpisodeBySlug);            // Lấy episode theo slug
router.post('/:id/view', incrementEpisodeView);         // Tăng view count

// Protected routes - Admin only
router.use(protect, authorize('admin'));

router.post('/', createEpisode);                        // Tạo episode mới
router.get('/:id', getEpisodeById);                     // Lấy episode theo ID
router.put('/:id', updateEpisode);                      // Cập nhật episode
router.delete('/:id', deleteEpisode);                   // Xóa episode

export default router;