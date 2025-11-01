import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import {
  getAllActors,
  getActorById,
  createActor,
  updateActor,
  deleteActor,
  permanentDeleteActor,
  searchActors,
  getActorsByNationality
} from '../controllers/actorController.js';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads', 'actors')
fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage })

// Route tìm kiếm 
router.get('/search', searchActors);

// Route theo quốc tịch
router.get('/nationality/:nationality', getActorsByNationality);

// CRUD routes
router.route('/')
  .get(getAllActors)
  .post(upload.single('photo'), createActor); // <-- accept multipart/form-data 'photo'

router.route('/:id')
  .get(getActorById)
  .put(upload.single('photo'), updateActor) // <-- accept photo on update
  .delete(deleteActor);

// Route xóa vĩnh viễn
router.delete('/:id/permanent', permanentDeleteActor);

export default router;