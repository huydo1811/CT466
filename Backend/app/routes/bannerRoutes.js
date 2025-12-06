import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(process.cwd(), 'uploads', 'banners');
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    } catch (err) {
      console.warn('mkdir failed', dest, err);
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/public', getAllBanners);          
router.get('/active', getActiveBanners);
router.post('/:id/view', incrementView);
router.post('/:id/click', incrementClick);

router.get('/admin/stats', protect, authorize('admin'), getBannerStats);
router.get('/', protect, authorize('admin'), getAllBanners);

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'image' }, 
    { name: 'mobileImage' },
    { name: 'video', maxCount: 1 } 
  ]),
  createBanner
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.fields([
    { name: 'image' }, 
    { name: 'mobileImage' },
    { name: 'video', maxCount: 1 } //  Thêm video upload
  ]),
  updateBanner
);

router.delete('/:id', protect, authorize('admin'), deleteBanner);
router.patch('/:id/toggle', protect, authorize('admin'), toggleBannerStatus);


router.get('/:id', getBannerById);

export default router;