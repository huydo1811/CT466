import express from 'express';
const router = express.Router()

import {
  createOrUpdateReview,
  getMovieReviews,
  getUserReviewForMovie,
  getUserReviews,
  deleteReview,
  adminDeleteReview,
  getReviewStats,
  reportReview,
  getAdminReviews,
  updateReview,
  markReviewed
} from '../controllers/reviewController.js'

import { protect, authorize } from '../middleware/auth.js'
import { markReportHandled } from '../controllers/reviewController.js'

// admin route: mark single report handled
router.post('/admin/:reviewId/reports/:reportId/handle', protect, authorize('admin'), markReportHandled)

// public / protected routes
router.get('/movie/:movieId', getMovieReviews)
router.post('/movie/:movieId', protect, createOrUpdateReview)
router.get('/movie/:movieId/user', protect, getUserReviewForMovie)
router.get('/user', protect, getUserReviews)
router.delete('/:id', protect, deleteReview)
router.post('/:id/report', protect, reportReview)

// admin routes: ensure protect + authorize('admin')
router.get('/admin', protect, authorize('admin'), getAdminReviews)
router.get('/admin/stats', protect, authorize('admin'), getReviewStats)
router.delete('/admin/:id', protect, authorize('admin'), adminDeleteReview)

// add PATCH for update (owner or admin)
router.patch('/:id', protect, updateReview)

// admin mark-reviewed (mark review + its reports as handled)
router.post('/admin/:id/mark-reviewed', protect, authorize('admin'), markReviewed)

export default router