import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  searchUsers,
  getUserStats,
  getMe,
  updateMe,
  getMyHistory,
  deleteHistoryItem,
  clearMyHistory
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// multer for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(process.cwd(), 'uploads', 'avatars')
    try { if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true }) } catch(e){/*ignore*/ }
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`)
  }
})
const upload = multer({ storage })

// protected for current user
router.use(protect)
router.get('/me', getMe)
router.put('/me', upload.single('avatar'), updateMe)

// history endpoints
router.get('/me/history', getMyHistory)
router.delete('/me/history', clearMyHistory)
router.delete('/me/history/:hid', deleteHistoryItem)

// admin-only routes
router.use(adminOnly)

router.get('/search', searchUsers)
router.get('/stats', getUserStats)

router.route('/')
  .get(getAllUsers)
  .post(createUser)

router.route('/:id')
  .get(getUserById)
  .put(updateUser)

export default router;