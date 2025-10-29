import Modal from '../ui/Modal';
import Button from '../ui/Button';

/**
 * Modal for displaying detailed style information
 * @param {boolean} isOpen - Modal visibility state
 * @param {Function} onClose - Close handler
 * @param {Object} style - Style object to display
 */
function StyleDetailModal({ isOpen, onClose, style }) {
  if (!style) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={style.name} size="lg">
      <div className="space-y-6">
        {/* Image */}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Beschrijving
          </h3>
          <p className="text-gray-600">{style.description}</p>
        </div>

        {/* Characteristics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Kenmerken
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {style.characteristics.map((char, index) => (
              <li key={index} className="text-gray-600">
                {char}
              </li>
            ))}
          </ul>
        </div>

        {/* Colors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Kleurenpalet
          </h3>
          <div className="flex gap-3">
            {style.colors.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs text-gray-500 mt-1">{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Materialen
          </h3>
          <div className="flex flex-wrap gap-2">
            {style.materials.map((material, index) => (
              <span
                key={index}
                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {material}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
          <Button variant="primary">Gebruik deze stijl</Button>
        </div>
      </div>
    </Modal>
  );
}

export default StyleDetailModal;
