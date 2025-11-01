import movieService from '../services/movieService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import path from 'path';

// Helper validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

const buildFileUrl = (req, filename, folder = 'movies') => {
  if (!filename) return undefined
  return `${req.protocol}://${req.get('host')}/uploads/${folder}/${filename}`
}

// Lấy tất cả phim với filters (Public)
export const getAllMovies = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    search: req.query.search,
    category: req.query.category,
    country: req.query.country,
    year: req.query.year ? parseInt(req.query.year) : undefined,
    type: req.query.type,
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

// Tạo phim mới (Admin)
export const createMovie = asyncHandler(async (req, res) => {
  const movieData = { ...req.body }

  // parse arrays sent as categories[] / actors[]
  if (req.body['categories[]']) {
    movieData.categories = Array.isArray(req.body['categories[]']) ? req.body['categories[]'] : [req.body['categories[]']]
  } else if (req.body.categories) {
    movieData.categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories]
  }

  if (req.body['actors[]']) {
    movieData.actors = Array.isArray(req.body['actors[]']) ? req.body['actors[]'] : [req.body['actors[]']]
  } else if (req.body.actors) {
    movieData.actors = Array.isArray(req.body.actors) ? req.body.actors : [req.body.actors]
  }

  // files from multer
  if (req.files) {
    if (req.files.poster && req.files.poster[0]) {
      movieData.poster = buildFileUrl(req, req.files.poster[0].filename, 'movies')
    }
    if (req.files.video && req.files.video[0]) {
      movieData.videoUrl = buildFileUrl(req, req.files.video[0].filename, 'movies')
    }
  }

  // convert booleans sent as strings
  if (typeof movieData.isPublished === 'string') movieData.isPublished = movieData.isPublished === 'true'
  if (typeof movieData.isFeatured === 'string') movieData.isFeatured = movieData.isFeatured === 'true'
  if (typeof movieData.isHot === 'string') movieData.isHot = movieData.isHot === 'true'

  const userId = req.user && req.user._id
  const movie = await movieService.createMovie(movieData, userId)

  res.status(201).json({
    success: true,
    message: 'Tạo phim thành công',
    data: movie
  });
});

// Cập nhật phim (Admin)
export const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movieData = { ...req.body }

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: 'ID phim không hợp lệ' });
  }

  // parse arrays like create
  if (req.body['categories[]']) {
    movieData.categories = Array.isArray(req.body['categories[]']) ? req.body['categories[]'] : [req.body['categories[]']]
  } else if (req.body.categories) {
    movieData.categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories]
  }

  if (req.body['actors[]']) {
    movieData.actors = Array.isArray(req.body['actors[]']) ? req.body['actors[]'] : [req.body['actors[]']]
  } else if (req.body.actors) {
    movieData.actors = Array.isArray(req.body.actors) ? req.body.actors : [req.body.actors]
  }

  if (req.files) {
    if (req.files.poster && req.files.poster[0]) {
      movieData.poster = buildFileUrl(req, req.files.poster[0].filename, 'movies')
    }
    if (req.files.video && req.files.video[0]) {
      movieData.videoUrl = buildFileUrl(req, req.files.video[0].filename, 'movies')
    }
  }

  // convert booleans
  if (typeof movieData.isPublished === 'string') movieData.isPublished = movieData.isPublished === 'true'
  if (typeof movieData.isFeatured === 'string') movieData.isFeatured = movieData.isFeatured === 'true'
  if (typeof movieData.isHot === 'string') movieData.isHot = movieData.isHot === 'true'

  const movie = await movieService.updateMovie(id, movieData);

  res.status(200).json({
    success: true,
    message: 'Cập nhật phim thành công',
    data: movie
  });
});

// Xóa phim (Admin)
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

// Toggle publish status (Admin)
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

// Tăng view count (Public)
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

// Thống kê phim (Admin)
export const getMovieStats = asyncHandler(async (req, res) => {
  const stats = await movieService.getMovieStats();
  
  res.status(200).json({
    success: true,
    message: 'Lấy thống kê phim thành công',
    data: stats
  });
});