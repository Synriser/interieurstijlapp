import express from 'express';
import {
  getAllPaintProducts,
  getPaintProductById,
  matchColorToPaint,
  getPopularPaintProducts,
  getPaintBrands,
  searchPaintProducts,
} from '../controllers/paint.controller.js';

const router = express.Router();

// GET /api/paint - Get all paint products
router.get('/', getAllPaintProducts);

// GET /api/paint/popular - Get popular products
router.get('/popular', getPopularPaintProducts);

// GET /api/paint/brands - Get all brands
router.get('/brands', getPaintBrands);

// GET /api/paint/search - Search products
router.get('/search', searchPaintProducts);

// POST /api/paint/match-color - Match hex color to products
router.post('/match-color', matchColorToPaint);

// GET /api/paint/:id - Get single product
router.get('/:id', getPaintProductById);

export default router;
