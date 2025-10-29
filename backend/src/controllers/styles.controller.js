import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Get all interior styles
 * @route GET /api/styles
 */
export const getAllStyles = async (req, res, next) => {
  try {
    const styles = await prisma.style.findMany();
    res.json(styles);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single style by ID
 * @route GET /api/styles/:id
 */
export const getStyleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const style = await prisma.style.findUnique({
      where: { id },
    });

    if (!style) {
      return res.status(404).json({ message: 'Style not found' });
    }

    res.json(style);
  } catch (error) {
    next(error);
  }
};
