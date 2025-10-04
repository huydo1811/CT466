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
router.get('/slug/:slug', getMovieBySlug);              // Chi tiết phim
router.post('/:id/view', incrementView);                // Tăng view count
router.get('/', getAllMovies);                          // Danh sách phim

// Protected routes - Admin only
router.use(protect, authorize('admin'));

router.post('/', createMovie);                          // Tạo phim mới
router.get('/admin/stats', getMovieStats);              // Thống kê phim
router.get('/:id', getMovieById);                       // Lấy phim theo ID
router.put('/:id', updateMovie);                        // Cập nhật phim
router.delete('/:id', deleteMovie);                     // Xóa phim  
router.patch('/:id/toggle', togglePublishStatus);       // Toggle publish

export default router;