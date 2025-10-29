import express from 'express';
import { getAllStyles, getStyleById } from '../controllers/styles.controller.js';

const router = express.Router();

router.get('/', getAllStyles);
router.get('/:id', getStyleById);

export default router;
