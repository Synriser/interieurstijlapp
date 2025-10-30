import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Share2,
  Calculator,
  Palette,
  Sparkles,
  Lightbulb,
  ArrowLeft,
  Mail,
  Info,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import PaintProductCard from '../components/modules/PaintProductCard';
import { styleTips } from '../data/styleTips';
import { styleRecommendations } from '../data/styleRecommendations';

/**
 * Visualization Results Page
 * Shows the final result with paint recommendations, decorations, tips, and cost estimation
 */
function VisualisatiePage() {
  const navigate = useNavigate();
  const [visualizationData, setVisualizationData] = useState(null);
  const [roomSize, setRoomSize] = useState(''); // Empty by default
  const [wallHeight, setWallHeight] = useState(2.5); // Default 2.5m
  const [showCostCalculator, setShowCostCalculator] = useState(false);

  // Load visualization data from localStorage or navigation state
  useEffect(() => {
    // Try to get data from localStorage (saved from Editor)
    const savedData = localStorage.getItem('visualizationData');
    if (savedData) {
      try {
        setVisualizationData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to parse visualization data:', e);
      }
    }
  }, []);

  // Redirect to editor if no data
  if (!visualizationData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-12 text-center">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Geen visualisatie beschikbaar
          </h2>
          <p className="text-gray-600 mb-6">
            Ga naar de editor om een ruimte te ontwerpen en te visualiseren.
          </p>
          <Button onClick={() => navigate('/editor')}>
            Ga naar Editor
          </Button>
        </Card>
      </div>
    );
  }

  const { processedImage, selectedStyle, selectedPaintProduct, selectedColor } =
    visualizationData;

  // Get recommendations for the selected style
  const recommendations = styleRecommendations[selectedStyle?.id] || null;
  const tips = styleTips[selectedStyle?.id] || null;

  // Calculate costs
  const calculateWallArea = () => {
    // Calculate wall area based on room length (assuming square room)
    // perimeter = 4 * length for square room
    if (!roomSize || roomSize === '') return 0;
    const perimeter = roomSize * 4;
    return perimeter * wallHeight;
  };

  const calculatePaintNeeded = () => {
    const wallArea = calculateWallArea();
    const coverage = selectedPaintProduct?.coverage || 10; // m² per liter
    return Math.ceil(wallArea / coverage);
  };

  const calculatePaintCost = () => {
    const liters = calculatePaintNeeded();
    const pricePerLiter = selectedPaintProduct?.price || 45;
    return liters * pricePerLiter;
  };

  // Export functions
  const downloadAsImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `interieur-${selectedStyle?.name || 'design'}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareViaEmail = () => {
    const subject = `Mijn Interieur Ontwerp - ${selectedStyle?.name} Stijl`;
    const body = `Bekijk mijn interieur ontwerp in de ${selectedStyle?.name} stijl!\n\nGebruikte verf: ${selectedPaintProduct?.brand} ${selectedPaintProduct?.colorName} (${selectedPaintProduct?.colorCode})`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Tab content components
  const PaintMaterialsTab = () => (
    <div className="space-y-6">
      {/* Selected Paint Product */}
      {selectedPaintProduct && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary-600" />
            Geselecteerde Verf
          </h3>
          <div className="max-w-md">
            <PaintProductCard product={selectedPaintProduct} isSelected={true} />
          </div>
        </div>
      )}

      {/* Cost Calculator */}
      <div>
        <button
          onClick={() => setShowCostCalculator(!showCostCalculator)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 hover:text-primary-600 transition-colors"
        >
          <Calculator className="w-5 h-5" />
          Kostenberekening
          <span className="text-sm text-gray-500 ml-2">
            {showCostCalculator ? '(verberg)' : '(toon)'}
          </span>
        </button>

        {showCostCalculator && (
          <Card className="p-6 bg-primary-50 border-primary-200">
            <div className="space-y-4">
              {/* Room Size Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Lengte (m)
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <span className="absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-normal">
                        Lengte van één wand in meters. Aanname: vierkante ruimte
                      </span>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={roomSize}
                    onChange={(e) => setRoomSize(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                    max="999"
                    step="0.1"
                    pattern="[0-9]{1,3}"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wandhoogte (m)
                  </label>
                  <input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="2"
                    max="5"
                  />
                </div>
              </div>

              {/* Calculations */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wandoppervlak:</span>
                  <span className="font-semibold text-gray-900">
                    ~{calculateWallArea().toFixed(1)} m²
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Benodigde liters verf:</span>
                  <span className="font-semibold text-gray-900">
                    {calculatePaintNeeded()} liter
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Dekking per liter ({selectedPaintProduct?.coverage || 10} m²):
                  </span>
                  <span className="font-semibold text-gray-900">
                    {selectedPaintProduct?.coverage || 10} m²/L
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Geschatte kosten:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    €{calculatePaintCost().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Prijzen zijn indicatief. Neem contact op met de leverancier
                  voor exacte prijzen en beschikbaarheid.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Material Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aanbevolen Materialen
        </h3>
        <Card className="p-6">
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <div>
                <span className="font-medium">Primer:</span> Gebruik een goede
                primer voor optimale dekking
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <div>
                <span className="font-medium">Afplaktape:</span> Kwaliteit
                afplaktape voor strakke lijnen
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <div>
                <span className="font-medium">Kwasten & Rollers:</span> Gebruik
                professioneel gereedschap
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              <div>
                <span className="font-medium">Afdekmaterialen:</span> Bescherm
                vloeren en meubels
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );

  const DecorationTab = () => (
    <div className="space-y-6">
      {recommendations ? (
        <>
          {/* Furniture Recommendations */}
          {recommendations.furniture.map((category, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {category.category}
              </h3>
              <Card className="p-6">
                <ul className="space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-3">
                      <span className="text-primary-600 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}

          {/* Decorations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Decoratie & Accessoires
            </h3>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendations.decorations.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Sparkles className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Lighting */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Verlichting
            </h3>
            <Card className="p-6">
              <ul className="space-y-2">
                {recommendations.lighting.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-yellow-500 mt-1">💡</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Textiles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Textiel
            </h3>
            <Card className="p-6">
              <ul className="space-y-2">
                {recommendations.textiles.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-primary-600 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500">
            Geen aanbevelingen beschikbaar voor deze stijl.
          </p>
        </Card>
      )}
    </div>
  );

  const StyleTipsTab = () => (
    <div className="space-y-4">
      {tips ? (
        <>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Stijltips voor {tips.name}
            </h3>
            <p className="text-primary-700 text-sm">
              Praktische tips en advies om jouw {tips.name.toLowerCase()}{' '}
              interieur perfect te maken.
            </p>
          </div>

          {tips.tips.map((tip, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                {tip.title}
              </h4>
              <p className="text-gray-700 leading-relaxed">{tip.content}</p>
            </Card>
          ))}
        </>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-500">
            Geen stijltips beschikbaar voor deze stijl.
          </p>
        </Card>
      )}
    </div>
  );

  // Tabs configuration
  const tabs = [
    {
      label: 'Verf & Materialen',
      icon: <Palette className="w-4 h-4" />,
      content: <PaintMaterialsTab />,
    },
    {
      label: 'Decoratie',
      icon: <Sparkles className="w-4 h-4" />,
      content: <DecorationTab />,
    },
    {
      label: 'Stijltips',
      icon: <Lightbulb className="w-4 h-4" />,
      content: <StyleTipsTab />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/editor')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Terug naar Editor
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jouw Visualisatie
        </h1>
        <p className="text-gray-600">
          {selectedStyle?.name} stijl met {selectedPaintProduct?.brand}{' '}
          {selectedPaintProduct?.colorName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Processed Image Preview */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Ontwerp Voorbeeld</h2>
            {processedImage && (
              <div className="relative">
                <img
                  src={processedImage}
                  alt="Processed room visualization"
                  className="w-full rounded-lg shadow-lg"
                />
                {selectedColor && (
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Geselecteerde kleur
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow"
                        style={{ backgroundColor: selectedColor }}
                      />
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {selectedColor}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="space-y-4">
          {/* Export Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Exporteer & Deel
            </h3>
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-center"
                onClick={downloadAsImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Download als Afbeelding
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={shareViaEmail}
              >
                <Mail className="w-4 h-4 mr-2" />
                Delen via Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  if (navigator.share && processedImage) {
                    navigator
                      .share({
                        title: `Mijn ${selectedStyle?.name} Interieur`,
                        text: 'Bekijk mijn interieur ontwerp!',
                        url: window.location.href,
                      })
                      .catch((err) => console.log('Error sharing:', err));
                  } else {
                    alert(
                      'Delen wordt niet ondersteund in deze browser. Gebruik de email optie.'
                    );
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Delen
              </Button>
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Snel Overzicht
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Stijl:</span>
                <p className="font-semibold text-gray-900">
                  {selectedStyle?.name}
                </p>
              </div>
              {selectedPaintProduct && (
                <>
                  <div>
                    <span className="text-gray-600">Verfmerk:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedPaintProduct.brand}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Kleur:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedPaintProduct.colorName}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Kleurcode:</span>
                    <p className="font-mono text-xs text-gray-900">
                      {selectedPaintProduct.colorCode}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Afwerking:</span>
                    <p className="font-semibold text-gray-900">
                      {selectedPaintProduct.finish}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <Card className="p-6">
        <Tabs tabs={tabs} defaultTab={0} />
      </Card>
    </div>
  );
}

export default VisualisatiePage;
