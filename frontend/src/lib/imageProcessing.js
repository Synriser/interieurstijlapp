/**
 * Image Processing Utilities
 * Canvas-based image manipulation for color replacement and wall detection
 */

/**
 * Load an image from a URL or File and return as HTMLImageElement
 * @param {string|File} source - Image URL or File object
 * @returns {Promise<HTMLImageElement>}
 */
export const loadImage = (source) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = reject;

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
};

/**
 * Create a canvas from an image
 * @param {HTMLImageElement} image
 * @param {number} maxWidth - Maximum width for optimization
 * @returns {Object} { canvas, ctx, width, height }
 */
export const createCanvas = (image, maxWidth = 1200) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Calculate dimensions maintaining aspect ratio
  let width = image.width;
  let height = image.height;

  if (width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = height * ratio;
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  return { canvas, ctx, width, height };
};

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color code
 * @returns {Object} { r, g, b }
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Calculate color distance between two RGB colors
 * @param {Object} c1 - { r, g, b }
 * @param {Object} c2 - { r, g, b }
 * @returns {number} Distance value
 */
export const colorDistance = (c1, c2) => {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
  );
};

/**
 * Detect wall colors in the image
 * Returns the most common light colors (likely to be walls)
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} sampleSize - Number of pixels to sample (for performance)
 * @returns {Array} Array of dominant colors { r, g, b, count }
 */
export const detectWallColors = (ctx, width, height, sampleSize = 5000) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const colorMap = new Map();

  // Sample pixels evenly across the image
  const step = Math.floor((data.length / 4) / sampleSize);

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels and very dark/bright pixels
    if (a < 128 || (r < 30 && g < 30 && b < 30) || (r > 240 && g > 240 && b > 240)) {
      continue;
    }

    // Check if it's a "wall-like" color (not too saturated)
    const brightness = (r + g + b) / 3;
    const saturation = Math.max(r, g, b) - Math.min(r, g, b);

    // Walls are typically light and not too saturated
    if (brightness > 100 && saturation < 100) {
      // Round colors to reduce variations
      const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;

      if (colorMap.has(key)) {
        colorMap.set(key, colorMap.get(key) + 1);
      } else {
        colorMap.set(key, 1);
      }
    }
  }

  // Convert to array and sort by frequency
  const colors = Array.from(colorMap.entries())
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Return top 5 wall colors

  return colors;
};

/**
 * Replace colors in the image
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} targetColor - RGB color to replace { r, g, b }
 * @param {Object} replacementColor - New RGB color { r, g, b }
 * @param {number} tolerance - Color matching tolerance (0-255)
 * @param {number} feather - Edge softness (0-100)
 * @returns {ImageData} Modified image data
 */
export const replaceColor = (
  canvas,
  ctx,
  targetColor,
  replacementColor,
  tolerance = 50,
  feather = 20
) => {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const currentColor = { r, g, b };
    const distance = colorDistance(currentColor, targetColor);

    if (distance <= tolerance) {
      // Calculate blend factor based on distance (for smooth edges)
      const blendFactor = feather > 0
        ? Math.max(0, 1 - (distance / (tolerance + feather)))
        : 1;

      // Blend between original and replacement color
      data[i] = r + (replacementColor.r - r) * blendFactor;
      data[i + 1] = g + (replacementColor.g - g) * blendFactor;
      data[i + 2] = b + (replacementColor.b - b) * blendFactor;
    }
  }

  return imageData;
};

/**
 * Apply color overlay with adjustable opacity and blend mode
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} hexColor - Hex color for overlay
 * @param {number} opacity - Opacity 0-1
 * @param {Array} maskColors - Array of RGB colors to apply overlay to
 * @param {number} tolerance - Color matching tolerance
 */
export const applyColorOverlay = (
  canvas,
  ctx,
  hexColor,
  opacity = 0.5,
  maskColors = null,
  tolerance = 50
) => {
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const overlayColor = hexToRgb(hexColor);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // If mask colors are specified, only apply to those colors
    let shouldApply = !maskColors;

    if (maskColors && maskColors.length > 0) {
      const currentColor = { r, g, b };
      shouldApply = maskColors.some(
        (maskColor) => colorDistance(currentColor, maskColor) <= tolerance
      );
    }

    if (shouldApply && a > 0) {
      // Blend overlay color with original
      data[i] = r + (overlayColor.r - r) * opacity;
      data[i + 1] = g + (overlayColor.g - g) * opacity;
      data[i + 2] = b + (overlayColor.b - b) * opacity;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Create a preview of color replacement
 * @param {HTMLImageElement} image - Original image
 * @param {Array} wallColors - Detected wall colors
 * @param {string} newColor - Hex color to apply
 * @param {Object} options - { tolerance, feather, opacity }
 * @returns {Promise<string>} Data URL of processed image
 */
export const createColorPreview = async (
  image,
  wallColors,
  newColor,
  options = {}
) => {
  const { tolerance = 50, feather = 20, opacity = 0.7 } = options;

  const { canvas, ctx } = createCanvas(image);

  if (wallColors && wallColors.length > 0) {
    // Apply overlay to detected wall colors
    applyColorOverlay(canvas, ctx, newColor, opacity, wallColors, tolerance);
  } else {
    // No wall colors detected, apply global overlay
    applyColorOverlay(canvas, ctx, newColor, opacity * 0.3);
  }

  return canvas.toDataURL('image/jpeg', 0.9);
};

/**
 * Adjust image brightness
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} adjustment - Brightness adjustment (-100 to 100)
 */
export const adjustBrightness = (ctx, width, height, adjustment) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] + adjustment));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment));
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Export utilities
 */
export default {
  loadImage,
  createCanvas,
  hexToRgb,
  colorDistance,
  detectWallColors,
  replaceColor,
  applyColorOverlay,
  createColorPreview,
  adjustBrightness,
};
