import express from 'express';
import { uploadImage } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

// POST /api/upload - Upload a single image
router.post('/', uploadMiddleware.single('image'), uploadImage);

export default router;
