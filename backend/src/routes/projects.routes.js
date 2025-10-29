import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} from '../controllers/projects.controller.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);

export default router;
