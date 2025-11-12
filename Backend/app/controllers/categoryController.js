import categoryService from '../services/categoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Lấy tất cả thể loại
export const getAllCategories = asyncHandler(async (req, res) => {
  const { limit, page, search, sortBy, withCount } = req.query;
  const result = await categoryService.getAllCategories({
    limit,
    page,
    search,
    sortBy,
    withCount: withCount === 'true'
  });
  
  res.status(200).json({
    success: true,
    data: result.categories,
    pagination: result.pagination
  });
});

// Lấy thể loại theo ID
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin thể loại thành công',
    data: category
  });
});

// Lấy thể loại theo slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin thể loại thành công',
    data: category
  });
});

// Tạo thể loại mới
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: 'Tạo thể loại thành công',
    data: category
  });
});

// Cập nhật thể loại
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Cập nhật thể loại thành công',
    data: category
  });
});

// Xóa thể loại
export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Xóa thể loại thành công'
  });
});

// Tìm kiếm thể loại
export const searchCategories = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Từ khóa tìm kiếm là bắt buộc'
    });
  }

  const categories = await categoryService.searchCategories(q);

  res.status(200).json({
    success: true,
    message: 'Tìm kiếm thể loại thành công',
    data: categories
  });
});