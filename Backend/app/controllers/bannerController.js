import bannerService from '../services/bannerService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Lấy tất cả banners (Admin + Public)
export const getAllBanners = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, position, isActive } = req.query;
  
  const filters = {};
  if (position) filters.position = position;
  if (isActive !== undefined) filters.isActive = isActive === 'true';
  
  const result = await bannerService.getAllBanners(
    parseInt(page),
    parseInt(limit),
    filters
  );
  
  res.status(200).json({
    success: true,
    message: 'Lấy danh sách banner thành công',
    data: result.banners,
    pagination: result.pagination
  });
});

// Lấy banners active theo position (Public)
export const getActiveBanners = asyncHandler(async (req, res) => {
  const { position = 'hero', limit = 5 } = req.query;
  
  const banners = await bannerService.getActiveBanners(position, parseInt(limit));
  
  res.status(200).json({
    success: true,
    message: `Lấy banner ${position} thành công`,
    data: banners
  });
});

// Lấy banner theo ID
export const getBannerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const banner = await bannerService.getBannerById(id);
  
  res.status(200).json({
    success: true,
    message: 'Lấy banner thành công',
    data: banner
  });
});

// Tạo banner mới (Admin only)
export const createBanner = asyncHandler(async (req, res) => {
  const bannerData = req.body;
  
  const banner = await bannerService.createBanner(bannerData);
  
  res.status(201).json({
    success: true,
    message: 'Tạo banner thành công',
    data: banner
  });
});

// Cập nhật banner (Admin only)
export const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const bannerData = req.body;
  
  const banner = await bannerService.updateBanner(id, bannerData);
  
  res.status(200).json({
    success: true,
    message: 'Cập nhật banner thành công',
    data: banner
  });
});

// Xóa banner (Admin only)
export const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await bannerService.deleteBanner(id);
  
  res.status(200).json({
    success: true,
    message: 'Xóa banner thành công'
  });
});

// Toggle trạng thái banner (Admin only)
export const toggleBannerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const banner = await bannerService.toggleBannerStatus(id);
  
  res.status(200).json({
    success: true,
    message: 'Thay đổi trạng thái banner thành công',
    data: banner
  });
});

// Tăng view count (Public)
export const incrementView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const banner = await bannerService.incrementView(id);
  
  res.status(200).json({
    success: true,
    message: 'Tăng view count thành công',
    data: {
      bannerId: banner._id,
      viewCount: banner.viewCount
    }
  });
});

// Tăng click count (Public)
export const incrementClick = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const banner = await bannerService.incrementClick(id);
  
  res.status(200).json({
    success: true,
    message: 'Tăng click count thành công',
    data: {
      bannerId: banner._id,
      clickCount: banner.clickCount,
      linkUrl: banner.linkUrl
    }
  });
});

// Lấy thống kê banner (Admin only)
export const getBannerStats = asyncHandler(async (req, res) => {
  const stats = await bannerService.getBannerStats();
  
  res.status(200).json({
    success: true,
    message: 'Lấy thống kê banner thành công',
    data: stats
  });
});