import episodeService from '../services/episodeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

// Lấy episodes của một series (Public)
export const getEpisodesByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { season } = req.query;
  
  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      success: false,
      message: 'ID movie không hợp lệ'
    });
  }
  
  const episodes = await episodeService.getEpisodesByMovie(movieId, season);
  
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách episodes thành công',
    data: episodes,
    count: episodes.length
  });
});

// Lấy episode theo slug (Public)
export const getEpisodeBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  
  const episode = await episodeService.getEpisodeBySlug(slug);
  
  res.status(200).json({
    success: true,
    message: 'Lấy thông tin episode thành công',
    data: episode
  });
});

// Tăng view count episode (Public)
export const incrementEpisodeView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID episode không hợp lệ'
    });
  }
  
  const episode = await episodeService.incrementView(id);
  
  res.status(200).json({
    success: true,
    message: 'Tăng view count thành công',
    data: {
      episodeId: episode._id,
      title: episode.title,
      viewCount: episode.viewCount
    }
  });
});

// Tạo episode mới (Admin only)
export const createEpisode = asyncHandler(async (req, res) => {
  const episodeData = req.body;
  const userId = req.user._id;
  
  const episode = await episodeService.createEpisode(episodeData, userId);
  
  res.status(201).json({
    success: true,
    message: 'Tạo episode thành công',
    data: episode
  });
});

// Lấy episode theo ID (Admin only)
export const getEpisodeById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID episode không hợp lệ'
    });
  }
  
  const episode = await episodeService.getEpisodeById(id);
  
  res.status(200).json({
    success: true,
    message: 'Lấy episode thành công',
    data: episode
  });
});

// Cập nhật episode (Admin only)
export const updateEpisode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const episodeData = req.body;
  const userId = req.user._id;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID episode không hợp lệ'
    });
  }
  
  const episode = await episodeService.updateEpisode(id, episodeData, userId);
  
  res.status(200).json({
    success: true,
    message: 'Cập nhật episode thành công',
    data: episode
  });
});

// Xóa episode (Admin only)
export const deleteEpisode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID episode không hợp lệ'
    });
  }
  
  await episodeService.deleteEpisode(id);
  
  res.status(200).json({
    success: true,
    message: 'Xóa episode thành công'
  });
});