import userService from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Lấy tất cả users (admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role, status } = req.query;
  
  const result = await userService.getAllUsers({
    page,
    limit,
    search,
    role,
    status
  });

  res.status(200).json({
    success: true,
    message: 'Lấy danh sách users thành công',
    data: result.users,
    pagination: result.pagination
  });
});

// Lấy user theo ID
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Lấy thông tin user thành công',
    data: user
  });
});

// Tạo user mới (admin only)
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(201).json({
    success: true,
    message: 'Tạo user thành công',
    data: user
  });
});

// Cập nhật user
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Cập nhật user thành công',
    data: user
  });
});

// Ban user
export const banUser = asyncHandler(async (req, res) => {
  await userService.banUser(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Ban user thành công'
  });
});

// Unban user
export const unbanUser = asyncHandler(async (req, res) => {
  await userService.unbanUser(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Unban user thành công'
  });
});

// Đổi role user
export const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  
  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Role là bắt buộc'
    });
  }

  await userService.changeUserRole(req.params.id, role);

  res.status(200).json({
    success: true,
    message: 'Đổi role thành công'
  });
});

// Tìm kiếm users
export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Từ khóa tìm kiếm là bắt buộc'
    });
  }

  const users = await userService.searchUsers(q);

  res.status(200).json({
    success: true,
    message: 'Tìm kiếm users thành công',
    data: users
  });
});

// Thống kê users
export const getUserStats = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStats();

  res.status(200).json({
    success: true,
    message: 'Lấy thống kê users thành công',
    data: stats
  });
});