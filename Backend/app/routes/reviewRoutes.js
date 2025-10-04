import express from 'express';
import {
  createOrUpdateReview,
  getMovieReviews,
  getUserReviewForMovie,
  getUserReviews,
  deleteReview,
  adminDeleteReview,
  getReviewStats
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/movie/:movieId', getMovieReviews);         // Lấy reviews của phim

// Protected routes - User
router.use(protect);

router.post('/movie/:movieId', createOrUpdateReview);   // Tạo/cập nhật review
router.get('/movie/:movieId/user', getUserReviewForMovie); // Review của user cho phim
router.get('/user', getUserReviews);                    // Tất cả reviews của user
router.delete('/:reviewId', deleteReview);              // Xóa review của mình

// Admin routes
router.use(authorize('admin'));

router.get('/admin/stats', getReviewStats);             // Thống kê reviews
router.delete('/admin/:reviewId', adminDeleteReview);   // Admin xóa review

export default router;