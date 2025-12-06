import asyncHandler from 'express-async-handler';
import * as bannerService from '../services/bannerService.js';
import Banner from '../models/Banner.js'; 
import fs from 'fs';
import path from 'path';

// Helper function
const buildFileUrl = (req, filename, folder = 'banners') => {
  if (!filename) return undefined;
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  return `${protocol}://${host}/uploads/${folder}/${filename}`;
};

const deleteUploadedFile = (url, folder = 'banners') => {
  if (!url) return;
  try {
    const filename = url.split('/').pop();
    const filepath = path.join(process.cwd(), 'uploads', folder, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch (err) {
    console.warn('Delete file failed:', err.message);
  }
};

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
  try {
    const { position, limit = 10 } = req.query;
    
    const now = new Date();

    const query = {
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    };
    
    // Add position filter if provided
    if (position) {
      query.position = position;
    }
    
    console.log('🔍 Query:', JSON.stringify(query, null, 2));
    
    const banners = await Banner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    console.log(` Found ${banners.length} banners`);
    
    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
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
  const bannerData = { ...req.body };

  // Map uploaded files
  if (req.files?.image?.[0]) {
    bannerData.image = buildFileUrl(req, req.files.image[0].filename, 'banners');
  }
  if (req.files?.mobileImage?.[0]) {
    bannerData.mobileImage = buildFileUrl(req, req.files.mobileImage[0].filename, 'banners');
  }
  
  //  Map video
  if (req.files?.video?.[0]) {
    bannerData.videoUrl = buildFileUrl(req, req.files.video[0].filename, 'banners');
  }

  //  Link type normalization
  if (bannerData.linkType === 'none') {
    bannerData.linkUrl = '';
    bannerData.targetId = null;
  }
  if (bannerData.linkType === 'external') {
    bannerData.targetId = null;
  }
  if (bannerData.linkType === 'movie' || bannerData.linkType === 'category') {
    bannerData.linkUrl = '';
  }

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
  const bannerData = { ...req.body };

  // Get existing banner để xóa file cũ
  let existing = null;
  try {
    existing = await bannerService.getBannerById(id);
  } catch (err) {
    console.warn('Could not fetch existing banner:', err.message);
  }

  // Map uploaded files
  if (req.files?.image?.[0]) {
    if (existing?.image) deleteUploadedFile(existing.image, 'banners');
    bannerData.image = buildFileUrl(req, req.files.image[0].filename, 'banners');
  }
  if (req.files?.mobileImage?.[0]) {
    if (existing?.mobileImage) deleteUploadedFile(existing.mobileImage, 'banners');
    bannerData.mobileImage = buildFileUrl(req, req.files.mobileImage[0].filename, 'banners');
  }
  
  //  Map video update
  if (req.files?.video?.[0]) {
    if (existing?.videoUrl) deleteUploadedFile(existing.videoUrl, 'banners');
    bannerData.videoUrl = buildFileUrl(req, req.files.video[0].filename, 'banners');
  }

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
  // get existing to delete files
  let existing = null
  try { existing = await bannerService.getBannerById(id) } catch {}
  if (existing) {
    if (existing.image) deleteUploadedFile(existing.image, 'banners')
    if (existing.mobileImage) deleteUploadedFile(existing.mobileImage, 'banners')
  }

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