import { X, Palette, Package, ImageIcon, CheckCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * Side panel for displaying detailed style information
 * Alternative to modal - slides in from the right side
 * @param {boolean} isOpen - Panel visibility state
 * @param {Function} onClose - Close handler
 * @param {Object} style - Style object to display
 * @param {Function} onSelectStyle - Handler for "Kies deze stijl" button
 */
function StyleDetailPanel({ isOpen, onClose, style, onSelectStyle }) {
  const navigate = useNavigate();

  if (!isOpen || !style) return null;

  const handleUseInEditor = () => {
    navigate(`/editor?style=${style.id}`);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{style.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Hero Image */}
          <div className="w-full h-64 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center overflow-hidden">
            {style.imageUrl ? (
              <img
                src={style.imageUrl}
                alt={style.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl font-bold text-primary-300">
                {style.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center mb-3">
              <ImageIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Over deze stijl
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{style.description}</p>
          </div>

          {/* Characteristics */}
          <div>
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Kenmerken</h3>
            </div>
            <ul className="space-y-2">
              {style.characteristics.map((char, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-600">{char}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Palette */}
          <div>
            <div className="flex items-center mb-3">
              <Palette className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Kleurenpalet
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {style.colors.map((color, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-full aspect-square rounded-lg border-2 border-gray-200 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500 mt-1 font-mono">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div>
            <div className="flex items-center mb-3">
              <Package className="w-5 h-5 text-primary-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Materialen
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {style.materials.map((material, index) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>

          {/* Example Images Section - Placeholder */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Voorbeeldfoto's
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Voorbeeldfoto's beschikbaar binnenkort
            </p>
          </div>
        </div>

        {/* Footer - Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleUseInEditor}
          >
            <Edit className="w-4 h-4 mr-2" />
            Gebruik in Editor
          </Button>
        </div>
      </div>
    </>
  );
}

export default StyleDetailPanel;
