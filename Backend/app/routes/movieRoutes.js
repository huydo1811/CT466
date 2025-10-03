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

const router = express.Router();

// Public routes
router.get('/search', searchMovies);                    // Tìm kiếm phim
router.get('/featured', getFeaturedMovies);             // Phim nổi bật
router.get('/latest', getLatestMovies);                 // Phim mới nhất  
router.get('/hot', getHotMovies);                       // Phim hot
router.get('/category/:categoryId', getMoviesByCategory); // Phim theo category
router.get('/slug/:slug', getMovieBySlug);              // Lấy phim theo slug (chi tiết)
router.post('/:id/view', incrementView);                // Tăng view count (KHI XEM PHIM)
router.get('/', getAllMovies);                          // Lấy tất cả phim

// Protected routes - Chỉ admin
router.use(protect, authorize('admin'));

router.post('/', createMovie);                          // Tạo phim mới
router.get('/admin/stats', getMovieStats);              // Thống kê (admin)
router.get('/:id', getMovieById);                       // Lấy phim theo ID (admin)
router.put('/:id', updateMovie);                        // Cập nhật phim
router.delete('/:id', deleteMovie);                     // Xóa phim  
router.patch('/:id/toggle', togglePublishStatus);       // Toggle publish

export default router;