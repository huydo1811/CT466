import express from 'express';
import {
  getAllBanners,
  getActiveBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  incrementView,
  incrementClick,
  getBannerStats
} from '../controllers/bannerController.js';
import { protect, authorize } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.get('/active', getActiveBanners);        
router.get('/:id', getBannerById);              
router.post('/:id/view', incrementView);        
router.post('/:id/click', incrementClick);      

// Protected routes - Chỉ admin
router.use(protect, authorize('admin')); 

router.route('/')
  .get(getAllBanners)                          
  .post(createBanner);                        

router.route('/:id')
  .put(updateBanner)                            
  .delete(deleteBanner);                     

router.patch('/:id/toggle', toggleBannerStatus); 
router.get('/admin/stats', getBannerStats);    

export default router;