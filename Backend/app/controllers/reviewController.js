import reviewService from '../services/reviewService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Tạo/cập nhật review (Protected)
export const createOrUpdateReview = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;
  
  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Điểm đánh giá phải từ 1-5 sao'
    });
  }
  
  const review = await reviewService.createOrUpdateReview(userId, movieId, {
    rating,
    comment
  });
  
  res.status(200).json({
    success: true,
    message: 'Đánh giá phim thành công',
    data: review
  });
});

// Lấy reviews của một phim (Public)
export const getMovieReviews = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { page, limit, sortBy, sortOrder, rating } = req.query;
  
  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder === 'asc' ? 1 : -1,
    rating: rating ? parseInt(rating) : undefined
  };
  
  const result = await reviewService.getMovieReviews(movieId, options);
  
  res.status(200).json({
    success: true,
    message: 'Lấy reviews thành công',
    data: result.reviews,
    ratingStats: result.ratingStats,
    pagination: result.pagination
  });
});

// Lấy review của user cho phim (Protected)
export const getUserReviewForMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  
  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const review = await reviewService.getUserReviewForMovie(userId, movieId);
  
  res.status(200).json({
    success: true,
    message: review ? 'Đã có review' : 'Chưa có review',
    data: review
  });
});

// Lấy tất cả reviews của user (Protected)
export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit, sortBy, sortOrder } = req.query;
  
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sortBy: sortBy || 'createdAt',
    sortOrder: sortOrder === 'asc' ? 1 : -1
  };
  
  const result = await reviewService.getUserReviews(userId, options);
  
  res.status(200).json({
    success: true,
    message: 'Lấy reviews của bạn thành công',
    data: result.reviews,
    pagination: result.pagination
  });
});

// Xóa review của mình (Protected)
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;
  
  if (!isValidObjectId(reviewId)) {
    return res.status(400).json({
      success: false,
      message: 'ID review không hợp lệ'
    });
  }
  
  await reviewService.deleteReview(reviewId, userId);
  
  res.status(200).json({
    success: true,
    message: 'Xóa review thành công'
  });
});

// Admin xóa review (Admin only)
export const adminDeleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  
  if (!isValidObjectId(reviewId)) {
    return res.status(400).json({
      success: false,
      message: 'ID review không hợp lệ'
    });
  }
  
  await reviewService.adminDeleteReview(reviewId);
  
  res.status(200).json({
    success: true,
    message: 'Xóa review thành công'
  });
});

// Thống kê reviews (Admin only)
export const getReviewStats = asyncHandler(async (req, res) => {
  const stats = await reviewService.getReviewStats();
  
  res.status(200).json({
    success: true,
    message: 'Lấy thống kê reviews thành công',
    data: stats
  });
});