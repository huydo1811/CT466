import express from 'express';
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry,
  searchCountries
} from '../controllers/countryController.js';

const router = express.Router();

// Route tìm kiếm - phải đặt trước route /:id
router.get('/search', searchCountries);

// CRUD routes
router.route('/')
  .get(getAllCountries)
  .post(createCountry);

router.route('/:id')
  .get(getCountryById)
  .put(updateCountry)
  .delete(deleteCountry);

export default router;