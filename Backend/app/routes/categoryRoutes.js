import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories
} from '../controllers/categoryController.js';

const router = express.Router();

// Route tìm kiếm
router.get('/search', searchCategories);

// Route slug (phải đặt trước /:id)
router.get('/slug/:slug', getCategoryBySlug);

// CRUD routes
router.route('/')
  .get(getAllCategories)
  .post(createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;