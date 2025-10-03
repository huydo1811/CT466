import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  searchUsers,
  getUserStats
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Tất cả routes cần admin permission
router.use(protect);    
router.use(adminOnly);  

// Route tìm kiếm
router.get('/search', searchUsers);

// Route thống kê
router.get('/stats', getUserStats);

// CRUD routes
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser);

export default router;