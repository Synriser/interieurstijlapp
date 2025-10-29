import { useState, useCallback, useEffect } from 'react';
import {
  loadImage,
  detectWallColors,
  createColorPreview,
} from '../lib/imageProcessing';

/**
 * Custom hook for image editor functionality
 * Manages image upload, wall detection, and color application
 */
export const useImageEditor = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [wallColors, setWallColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    tolerance: 50,
    feather: 20,
    opacity: 0.7,
  });

  /**
   * Load and analyze an image
   */
  const loadAndAnalyzeImage = useCallback(async (source) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Load the image
      const img = await loadImage(source);
      setOriginalImage(img.src);

      // Create canvas and detect wall colors
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size
      const maxWidth = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Detect wall colors
      const detectedColors = detectWallColors(ctx, width, height);
      setWallColors(detectedColors);

      // Set initial processed image to original
      setProcessedImage(img.src);

      setIsProcessing(false);
      return { success: true, wallColors: detectedColors };
    } catch (err) {
      console.error('Error loading image:', err);
      setError('Kon afbeelding niet laden. Probeer een andere foto.');
      setIsProcessing(false);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Apply a color to the image
   */
  const applyColor = useCallback(
    async (hexColor) => {
      if (!originalImage) {
        setError('Geen afbeelding geladen');
        return;
      }

      setIsProcessing(true);
      setError(null);
      setSelectedColor(hexColor);

      try {
        const img = await loadImage(originalImage);
        const preview = await createColorPreview(
          img,
          wallColors,
          hexColor,
          settings
        );

        setProcessedImage(preview);
        setIsProcessing(false);
      } catch (err) {
        console.error('Error applying color:', err);
        setError('Kon kleur niet toepassen');
        setIsProcessing(false);
      }
    },
    [originalImage, wallColors, settings]
  );

  /**
   * Reset to original image
   */
  const resetImage = useCallback(() => {
    setProcessedImage(originalImage);
    setSelectedColor(null);
  }, [originalImage]);

  /**
   * Update processing settings
   */
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  /**
   * Re-apply current color with new settings
   */
  useEffect(() => {
    if (selectedColor && originalImage) {
      applyColor(selectedColor);
    }
  }, [settings]); // Only re-apply when settings change

  /**
   * Clear all state
   */
  const clearEditor = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setWallColors([]);
    setSelectedColor(null);
    setError(null);
    setSettings({
      tolerance: 50,
      feather: 20,
      opacity: 0.7,
    });
  }, []);

  return {
    // State
    originalImage,
    processedImage,
    wallColors,
    selectedColor,
    isProcessing,
    error,
    settings,

    // Actions
    loadAndAnalyzeImage,
    applyColor,
    resetImage,
    updateSettings,
    clearEditor,
  };
};

export default useImageEditor;
