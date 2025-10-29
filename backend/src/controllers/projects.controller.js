import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new project
 * @route POST /api/projects
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, imageUrl, styleId, customColors } = req.body;

    // Validate required fields
    if (!name || !imageUrl || !styleId) {
      return res.status(400).json({
        message: 'Missing required fields: name, imageUrl, styleId',
      });
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        imageUrl,
        styleId,
        customColors: customColors || [],
      },
      include: {
        style: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects
 * @route GET /api/projects
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        style: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single project by ID
 * @route GET /api/projects/:id
 */
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        style: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a project
 * @route DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Project not found' });
    }
    next(error);
  }
};
