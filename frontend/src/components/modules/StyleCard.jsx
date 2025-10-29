import Card from '../ui/Card';

/**
 * Style card component for displaying interior style information
 * @param {Object} style - Style object with name, description, colors, etc.
 * @param {Function} onClick - Click handler for card
 * @param {boolean} isSelected - Whether this style is currently selected
 */
function StyleCard({ style, onClick, isSelected = false }) {
  return (
    <Card
      onClick={onClick}
      hover={true}
      className={`transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary-500 shadow-lg' : ''
      }`}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
        {style.imageUrl ? (
          <img
            src={style.imageUrl}
            alt={style.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-primary-300">
            {style.name.charAt(0)}
          </span>
        )}
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Geselecteerd
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {style.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {style.description}
        </p>

        {/* Color palette */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {style.colors.slice(0, 5).map((color, index) => (
            <div
              key={index}
              className="w-7 h-7 rounded-full border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        {/* Materials preview */}
        <div className="flex flex-wrap gap-1">
          {style.materials.slice(0, 3).map((material, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
            >
              {material}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default StyleCard;
