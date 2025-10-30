import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Palette,
  Settings,
  RotateCcw,
  Download,
  Loader,
  Droplets,
  Eye,
  Home,
  Camera,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import PaintProductCard from '../components/modules/PaintProductCard';
import RoomViewer from '../components/modules/RoomViewer';
import { useImageEditor } from '../hooks/useImageEditor';
import { exampleRooms, getCategories } from '../data/exampleRooms';
import { interiorStyles } from '../data/styles';
import { roomTemplates, getRoomTemplate } from '../data/roomTemplates';
import { matchColorToPaint } from '../utils/api';

/**
 * Complete Editor Page with image upload and color replacement
 * Implements PRD requirements for Interior Editor module
 */
function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const styleIdFromUrl = searchParams.get('style');

  // Mode selection: 'photo' or 'room'
  const [editorMode, setEditorMode] = useState('room');

  // Common state
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [matchedPaintProducts, setMatchedPaintProducts] = useState([]);
  const [selectedPaintProduct, setSelectedPaintProduct] = useState(null);
  const [isLoadingPaintProducts, setIsLoadingPaintProducts] = useState(false);

  // Photo mode state
  const [showExamplesModal, setShowExamplesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Room template mode state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomElement, setSelectedRoomElement] = useState(null);
  const [roomElementColors, setRoomElementColors] = useState({});
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const {
    originalImage,
    processedImage,
    wallColors,
    selectedColor,
    isProcessing,
    error,
    settings,
    loadAndAnalyzeImage,
    applyColor,
    resetImage,
    updateSettings,
    clearEditor,
  } = useImageEditor();

  // Load style from URL parameter
  useEffect(() => {
    console.log('EditorPage mounted/updated');
    console.log('Style ID from URL:', styleIdFromUrl);
    console.log('Available styles:', interiorStyles.map(s => ({ id: s.id, name: s.name })));

    if (styleIdFromUrl) {
      const style = interiorStyles.find((s) => s.id === styleIdFromUrl);
      console.log('Found style:', style);
      if (style) {
        setSelectedStyle(style);
        console.log('✓ Style set to:', style.name);
      } else {
        console.error('❌ Style not found for ID:', styleIdFromUrl);
        console.error('Available IDs:', interiorStyles.map(s => s.id));
      }
    } else {
      console.log('No style ID in URL');
    }
  }, [styleIdFromUrl]);

  // File upload with dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await loadAndAnalyzeImage(acceptedFiles[0]);
      }
    },
  });

  // Handle example room selection
  const handleExampleSelect = async (room) => {
    await loadAndAnalyzeImage(room.imageUrl);
    setShowExamplesModal(false);
  };

  // Handle color application
  const handleColorClick = async (color, index) => {
    setSelectedColorIndex(index);
    applyColor(color);

    // Find matching paint products
    await findMatchingPaintProducts(color);
  };

  // Find matching paint products for a color
  const findMatchingPaintProducts = async (hexColor) => {
    setIsLoadingPaintProducts(true);
    try {
      const response = await matchColorToPaint(hexColor, {
        maxResults: 6,
        maxDistance: 80,
      });
      setMatchedPaintProducts(response.data.matches || []);
      setSelectedPaintProduct(null); // Reset selection
    } catch (error) {
      console.error('Error finding paint products:', error);
      setMatchedPaintProducts([]);
    } finally {
      setIsLoadingPaintProducts(false);
    }
  };

  // Handle paint product selection
  const handlePaintProductSelect = (product) => {
    setSelectedPaintProduct(product);
    // Apply the exact paint color
    applyColor(product.hexColor);
  };

  // Download processed image
  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `interieurstijl-${Date.now()}.jpg`;
    link.click();
  };

  // Reset everything
  const handleReset = () => {
    clearEditor();
    setSelectedStyle(null);
    setSelectedColorIndex(0);
  };

  // Save to visualization
  const handleSaveToVisualization = () => {
    if (editorMode === 'photo') {
      if (!processedImage || !selectedStyle) {
        alert('Selecteer eerst een stijl en verwerk een foto om door te gaan naar de visualisatie.');
        return;
      }

      // Save data to localStorage
      const visualizationData = {
        processedImage,
        originalImage,
        selectedStyle,
        selectedPaintProduct,
        selectedColor,
        timestamp: Date.now(),
      };

      localStorage.setItem('visualizationData', JSON.stringify(visualizationData));
    } else {
      // Room mode - save SVG data
      if (!selectedRoom || !selectedStyle) {
        alert('Selecteer eerst een stijl en een ruimte om door te gaan naar de visualisatie.');
        return;
      }

      const visualizationData = {
        roomMode: true,
        selectedRoom,
        roomElementColors,
        selectedStyle,
        selectedPaintProduct,
        timestamp: Date.now(),
      };

      localStorage.setItem('visualizationData', JSON.stringify(visualizationData));
    }

    // Navigate to visualization page
    navigate('/visualisatie');
  };

  // Room template handlers
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setSelectedRoomElement(null);
    setRoomElementColors({});
    setShowRoomSelector(false);
  };

  const handleRoomElementClick = (element) => {
    setSelectedRoomElement(element);
  };

  const handleApplyColorToElement = async (color) => {
    if (!selectedRoomElement) return;

    // Update room element colors
    setRoomElementColors((prev) => ({
      ...prev,
      [selectedRoomElement.id]: color,
    }));

    // Find matching paint products
    await findMatchingPaintProducts(color);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interieur Editor
          </h1>
          <p className="text-gray-600">
            Kies een modus en experimenteer met kleuren in je ruimte
          </p>

          {/* Mode Toggle - Hidden */}
          <div className="mt-4 inline-flex rounded-lg border border-gray-300 bg-white p-1" style={{ display: 'none' }}>
            <button
              onClick={() => setEditorMode('room')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                editorMode === 'room'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              Ruimte Template
            </button>
            <button
              onClick={() => setEditorMode('photo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                editorMode === 'photo'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              Foto Uploaden
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Image Upload & Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Style Selection */}
            {selectedStyle ? (
              <Card className="p-4 bg-primary-50 border-primary-200">
                <h3 className="text-sm font-semibold text-primary-700 mb-3">
                  ✓ Gekozen Stijl
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white shadow-md">
                    {selectedStyle.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {selectedStyle.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedStyle.description.substring(0, 40)}...
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {selectedStyle.colors.slice(0, 5).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </Card>
            ) : (
              <Card className="p-4 bg-gray-50">
                <div className="text-center py-3">
                  <p className="text-sm text-gray-600">
                    Geen stijl geselecteerd
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ga naar Stijlen om te kiezen
                  </p>
                </div>
              </Card>
            )}

            {/* Room Template Selector */}
            {editorMode === 'room' && !selectedRoom && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Kies een Ruimte</h3>
                <div className="space-y-3">
                  {roomTemplates.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <p className="font-medium text-gray-900">{room.name}</p>
                      <p className="text-sm text-gray-600">{room.category}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Room Actions */}
            {editorMode === 'room' && selectedRoom && (
              <Card className="p-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedRoom(null);
                      setSelectedRoomElement(null);
                      setRoomElementColors({});
                    }}
                  >
                    Andere Ruimte
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full bg-accent-600 hover:bg-accent-700"
                    onClick={handleSaveToVisualization}
                    disabled={!selectedStyle}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Bekijk Visualisatie
                  </Button>
                </div>
              </Card>
            )}

            {/* Upload Section */}
            {editorMode === 'photo' && !originalImage && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Upload Foto</h3>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  {isDragActive ? (
                    <p className="text-primary-600 text-sm">
                      Drop de foto hier...
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm mb-1">
                        Sleep een foto hierheen
                      </p>
                      <p className="text-gray-500 text-xs">of klik om te uploaden</p>
                      <p className="text-gray-400 text-xs mt-2">
                        PNG, JPG, JPEG (max 10MB)
                      </p>
                    </>
                  )}
                </div>

                {/* Or Examples */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Of</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowExamplesModal(true)}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Kies Voorbeeldruimte
                </Button>
              </Card>
            )}

            {/* Detected Wall Colors */}
            {wallColors.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Gedetecteerde Muurtinten
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {wallColors.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded border-2 border-gray-200"
                      style={{
                        backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
                      }}
                      title={`RGB(${color.r}, ${color.g}, ${color.b})`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Deze kleuren worden vervangen
                </p>
              </Card>
            )}

            {/* Settings */}
            {originalImage && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Instellingen
                  </h3>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Intensiteit: {Math.round(settings.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.opacity * 100}
                      onChange={(e) =>
                        updateSettings({
                          opacity: parseInt(e.target.value) / 100,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">
                      Tolerantie: {settings.tolerance}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={settings.tolerance}
                      onChange={(e) =>
                        updateSettings({ tolerance: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            {originalImage && (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetImage}
                  disabled={!selectedColor}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Kleur
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleDownload}
                  disabled={!processedImage}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="primary"
                  className="w-full bg-accent-600 hover:bg-accent-700"
                  onClick={handleSaveToVisualization}
                  disabled={!processedImage || !selectedStyle}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Bekijk Visualisatie
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  onClick={handleReset}
                >
                  Nieuw Begin
                </Button>
              </div>
            )}
          </div>

          {/* Center Panel - Preview */}
          <div className="lg:col-span-6">
            {editorMode === 'room' ? (
              /* Room Template Mode */
              selectedRoom ? (
                <RoomViewer
                  roomTemplate={selectedRoom}
                  onElementClick={handleRoomElementClick}
                  selectedElementId={selectedRoomElement?.id}
                  elementColors={roomElementColors}
                />
              ) : (
                <Card className="p-6 h-full flex items-center justify-center">
                  <div className="text-center">
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Selecteer een ruimte om te beginnen
                    </p>
                  </div>
                </Card>
              )
            ) : (
              /* Photo Upload Mode */
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Voorbeeld</h3>
                  {isProcessing && (
                    <div className="flex items-center text-primary-600 text-sm">
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Bezig met verwerken...
                    </div>
                  )}
                </div>

                {/* Preview Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-12">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Upload een foto of kies een voorbeeldruimte om te beginnen
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Info */}
                {originalImage && !isProcessing && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                    <p className="text-blue-900">
                      💡 <strong>Tip:</strong> Klik op een kleur rechts om deze toe
                      te passen. Pas de intensiteit en tolerantie aan voor het beste
                      resultaat.
                    </p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Panel - Color Selection */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Palette className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold">Kleurenpalet</h3>
              </div>

              {selectedStyle ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Kleuren van {selectedStyle.name} stijl
                  </p>

                  {/* Style Colors */}
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {selectedStyle.colors.map((color, index) => {
                      const isDisabled = editorMode === 'photo' ? (!originalImage || isProcessing) : (!selectedRoom || !selectedRoomElement);
                      const isSelected = editorMode === 'room'
                        ? (selectedRoomElement && roomElementColors[selectedRoomElement.id] === color)
                        : (selectedColor === color);

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (editorMode === 'photo') {
                              handleColorClick(color, index);
                            } else {
                              handleApplyColorToElement(color);
                            }
                          }}
                          disabled={isDisabled}
                          className={`group relative aspect-square rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-primary-600 ring-2 ring-primary-200'
                              : 'border-gray-200 hover:border-primary-400'
                          } ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Color Info */}
                  {selectedColor && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Gekozen kleur:</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {selectedColor}
                      </p>
                    </div>
                  )}

                  {/* Style Materials */}
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Aanbevolen Materialen
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStyle.materials.map((material, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm mb-4">
                    Kies eerst een stijl op de Stijlen pagina
                  </p>
                  <Button variant="primary" onClick={() => (window.location.href = '/')}>
                    Naar Stijlen
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Paint Products Section */}
        {matchedPaintProducts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Droplets className="w-6 h-6 text-primary-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verfproducten
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Passende verfproducten voor de gekozen kleur
                  </p>
                </div>
              </div>
              {selectedPaintProduct && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Geselecteerd:</p>
                  <p className="font-semibold text-gray-900">
                    {selectedPaintProduct.brand} - {selectedPaintProduct.colorName}
                  </p>
                </div>
              )}
            </div>

            {isLoadingPaintProducts ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-primary-600 animate-spin" />
                <p className="ml-3 text-gray-600">
                  Zoeken naar passende verfproducten...
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedPaintProducts.map((product) => (
                    <PaintProductCard
                      key={product.id}
                      product={product}
                      onSelect={handlePaintProductSelect}
                      isSelected={selectedPaintProduct?.id === product.id}
                    />
                  ))}
                </div>

                {/* Info box */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tip:</strong> Klik op "Selecteer" bij een verfproduct
                    om de exacte kleur van dat product toe te passen. De match-score
                    geeft aan hoe goed het product past bij je gekozen kleur.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Example Rooms Modal */}
      <Modal
        isOpen={showExamplesModal}
        onClose={() => setShowExamplesModal(false)}
        title="Kies een Voorbeeldruimte"
        size="xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {exampleRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleExampleSelect(room)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-500 transition-all"
            >
              <img
                src={room.thumbnail}
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-3 text-left">
                  <p className="text-white font-medium text-sm">{room.name}</p>
                  <p className="text-white/80 text-xs">{room.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Geavanceerde Instellingen"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intensiteit: {Math.round(settings.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.opacity * 100}
              onChange={(e) =>
                updateSettings({ opacity: parseInt(e.target.value) / 100 })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hoe sterk de nieuwe kleur wordt toegepast
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tolerantie: {settings.tolerance}
            </label>
            <input
              type="range"
              min="10"
              max="150"
              value={settings.tolerance}
              onChange={(e) =>
                updateSettings({ tolerance: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hoe veel verschillende tinten worden vervangen
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zachte Randen: {settings.feather}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.feather}
              onChange={(e) =>
                updateSettings({ feather: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maakt de overgangen tussen kleuren vloeiender
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditorPage;
