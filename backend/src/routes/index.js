import express from 'express';
import stylesRoutes from './styles.routes.js';
import uploadRoutes from './upload.routes.js';
import projectsRoutes from './projects.routes.js';
import paintRoutes from './paint.routes.js';

const router = express.Router();

router.use('/styles', stylesRoutes);
router.use('/upload', uploadRoutes);
router.use('/projects', projectsRoutes);
router.use('/paint', paintRoutes);

export default router;
