import express from 'express';
import { autocomplete, reverseGeocode, trackRoute } from '../controllers/locationController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

// Autocomplete locations
router.get('/autocomplete', autocomplete);

// Reverse geocode coordinates
router.get('/reverse-geocode', reverseGeocode);

// Track route between locations
router.post('/track', userAuth, trackRoute);

export default router;

