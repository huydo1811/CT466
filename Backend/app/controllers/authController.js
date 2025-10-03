import authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Đăng ký
export const register = asyncHandler(async (req, res) => {
  const { username, passwordHash, email, fullName, role } = req.body;

  // Validate input
  if (!username || !passwordHash || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Tên đăng nhập và mật khẩu là bắt buộc'
    });
  }

  // Tạo user mới
  const user = await authService.register({ username, passwordHash, email, fullName, role });

  // Generate token
  const token = authService.generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công',
    data: user,
    token
  });
});

// Đăng nhập
export const login = asyncHandler(async (req, res) => {
  const { username, passwordHash } = req.body;

  // Validate input
  if (!username || !passwordHash) {
    return res.status(400).json({
      success: false,
      message: 'Tên đăng nhập và mật khẩu là bắt buộc'
    });
  }

  // Đăng nhập
  const user = await authService.login(username, passwordHash);

  // Generate token
  const token = authService.generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    data: user,
    token
  });
});

// Get profile
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, email },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    data: user
  });
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc'
    });
  }

  await authService.changePassword(req.user.id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});