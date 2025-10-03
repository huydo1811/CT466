import express from 'express';
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

// Route tìm kiếm 
router.get('/search', searchActors);

// Route theo quốc tịch
router.get('/nationality/:nationality', getActorsByNationality);

// CRUD routes
router.route('/')
  .get(getAllActors)
  .post(createActor);

router.route('/:id')
  .get(getActorById)
  .put(updateActor)
  .delete(deleteActor);

// Route xóa vĩnh viễn
router.delete('/:id/permanent', permanentDeleteActor);

export default router;