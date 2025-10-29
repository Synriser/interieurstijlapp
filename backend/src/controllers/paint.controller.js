import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Color matching utility
 * Calculates color distance using weighted RGB formula
 */
function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return Infinity;

  // Weighted RGB distance formula (human eye perception)
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;

  return Math.sqrt(
    2 * rDiff * rDiff +
    4 * gDiff * gDiff +
    3 * bDiff * bDiff
  );
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get all paint products
 * @route GET /api/paint
 */
export const getAllPaintProducts = async (req, res, next) => {
  try {
    const {
      brand,
      finish,
      popular,
      limit = 50,
      offset = 0,
    } = req.query;

    const where = {};

    if (brand) where.brand = brand;
    if (finish) where.finish = finish;
    if (popular === 'true') where.popular = true;

    const products = await prisma.paintProduct.findMany({
      where,
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: [
        { popular: 'desc' },
        { brand: 'asc' },
        { colorName: 'asc' },
      ],
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get paint product by ID
 * @route GET /api/paint/:id
 */
export const getPaintProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.paintProduct.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Paint product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Find paint products by color
 * Matches hex color to closest available paint products
 * @route POST /api/paint/match-color
 */
export const matchColorToPaint = async (req, res, next) => {
  try {
    const { hexColor, maxResults = 5, maxDistance = 100 } = req.body;

    if (!hexColor) {
      return res.status(400).json({ message: 'hexColor is required' });
    }

    // Get all products
    const allProducts = await prisma.paintProduct.findMany({
      where: { inStock: true },
    });

    // Calculate distance for each product
    const productsWithDistance = allProducts.map((product) => ({
      ...product,
      distance: colorDistance(hexColor, product.hexColor),
    }));

    // Sort by distance and filter by max distance
    const matches = productsWithDistance
      .filter((p) => p.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);

    res.json({
      requestedColor: hexColor,
      matches: matches.map((m) => ({
        ...m,
        matchScore: Math.max(0, 100 - (m.distance / maxDistance) * 100),
      })),
      totalMatches: matches.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular paint products
 * @route GET /api/paint/popular
 */
export const getPopularPaintProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const products = await prisma.paintProduct.findMany({
      where: { popular: true, inStock: true },
      take: parseInt(limit),
      orderBy: [
        { brand: 'asc' },
        { colorName: 'asc' },
      ],
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Get paint brands
 * @route GET /api/paint/brands
 */
export const getPaintBrands = async (req, res, next) => {
  try {
    const brands = await prisma.paintProduct.groupBy({
      by: ['brand'],
      _count: {
        brand: true,
      },
      orderBy: {
        brand: 'asc',
      },
    });

    const formatted = brands.map((b) => ({
      name: b.brand,
      productCount: b._count.brand,
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

/**
 * Search paint products
 * @route GET /api/paint/search
 */
export const searchPaintProducts = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query too short' });
    }

    const query = q.toLowerCase();

    const products = await prisma.paintProduct.findMany({
      where: {
        OR: [
          { colorName: { contains: query, mode: 'insensitive' } },
          { colorCode: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
        inStock: true,
      },
      take: parseInt(limit),
      orderBy: {
        popular: 'desc',
      },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};
