import movieService from '../services/movieService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

// Helper function validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Lấy tất cả phim với filters (Public + Admin)
export const getAllMovies = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    search: req.query.search,
    category: req.query.category,
    country: req.query.country,
    year: req.query.year ? parseInt(req.query.year) : undefined,
    quality: req.query.quality,
    type: req.query.type,
    status: req.query.status,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder === 'asc' ? 1 : -1,
    isPublished: req.query.isPublished !== undefined ? req.query.isPublished === 'true' : true
  };
  
  const result = await movieService.getAllMovies(options);
  
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách phim thành công',
    data: result.movies,
    pagination: result.pagination,
    filters: {
      search: options.search,
      category: options.category,
      country: options.country,
      year: options.year,
      quality: options.quality,
      type: options.type
    }
  });
});

// Lấy phim theo slug (Public)
export const getMovieBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  const movie = await movieService.getMovieBySlug(slug);
  
  res.status(200).json({
    success: true,
    message: 'Lấy thông tin phim thành công',
    data: movie
  });
});

// Lấy phim theo ID (Admin)
export const getMovieById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const movie = await movieService.getMovieById(id);
  
  res.status(200).json({
    success: true,
    message: 'Lấy phim thành công',
    data: movie
  });
});

// Tạo phim mới (Admin only)
export const createMovie = asyncHandler(async (req, res) => {
  const movieData = req.body;
  const userId = req.user._id;
  
  const movie = await movieService.createMovie(movieData, userId);
  
  res.status(201).json({
    success: true,
    message: 'Tạo phim thành công',
    data: movie
  });
});

// Cập nhật phim (Admin only)
export const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movieData = req.body;
  const userId = req.user._id;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const movie = await movieService.updateMovie(id, movieData, userId);
  
  res.status(200).json({
    success: true,
    message: 'Cập nhật phim thành công',
    data: movie
  });
});

// Xóa phim (Admin only)
export const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  await movieService.deleteMovie(id);
  
  res.status(200).json({
    success: true,
    message: 'Xóa phim thành công'
  });
});

// Toggle publish status (Admin only)
export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const movie = await movieService.togglePublishStatus(id);
  
  res.status(200).json({
    success: true,
    message: `Phim đã ${movie.isPublished ? 'được xuất bản' : 'bị ẩn'}`,
    data: {
      _id: movie._id,
      title: movie.title,
      isPublished: movie.isPublished
    }
  });
});

// Lấy phim nổi bật (Public)
export const getFeaturedMovies = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const movies = await movieService.getFeaturedMovies(limit);
  
  res.status(200).json({
    success: true,
    message: 'Lấy phim nổi bật thành công',
    data: movies,
    count: movies.length
  });
});

// Lấy phim mới nhất (Public)
export const getLatestMovies = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  
  const movies = await movieService.getLatestMovies(limit);
  
  res.status(200).json({
    success: true,
    message: 'Lấy phim mới nhất thành công',
    data: movies,
    count: movies.length
  });
});

// Lấy phim hot (Public)
export const getHotMovies = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  
  const movies = await movieService.getHotMovies(limit);
  
  res.status(200).json({
    success: true,
    message: 'Lấy phim hot thành công',
    data: movies,
    count: movies.length
  });
});

// Tăng view count (Public) - KHI USER XEM PHIM
export const incrementView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID phim không hợp lệ'
    });
  }
  
  const movie = await movieService.incrementView(id);
  
  res.status(200).json({
    success: true,
    message: 'Tăng view count thành công',
    data: {
      movieId: movie._id,
      title: movie.title,
      viewCount: movie.viewCount
    }
  });
});

// Tìm kiếm phim (Public)
export const searchMovies = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
    });
  }
  
  const options = {
    search: q.trim(),
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    category: req.query.category,
    country: req.query.country,
    year: req.query.year ? parseInt(req.query.year) : undefined,
    quality: req.query.quality,
    type: req.query.type
  };
  
  const result = await movieService.getAllMovies(options);
  
  res.status(200).json({
    success: true,
    message: `Tìm thấy ${result.pagination.totalItems} kết quả cho "${q}"`,
    data: result.movies,
    pagination: result.pagination,
    searchQuery: q
  });
});

// Lấy thống kê phim (Admin only)
export const getMovieStats = asyncHandler(async (req, res) => {
  const stats = await movieService.getMovieStats();
  
  res.status(200).json({
    success: true,
    message: 'Lấy thống kê phim thành công',
    data: stats
  });
});

// Lấy phim theo category (Public)
export const getMoviesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({
      success: false,
      message: 'ID category không hợp lệ'
    });
  }
  
  const options = {
    category: categoryId,
    page,
    limit,
    sortBy: req.query.sortBy || 'createdAt',
    sortOrder: req.query.sortOrder === 'asc' ? 1 : -1
  };
  
  const result = await movieService.getAllMovies(options);
  
  res.status(200).json({
    success: true,
    message: 'Lấy phim theo category thành công',
    data: result.movies,
    pagination: result.pagination
  });
});