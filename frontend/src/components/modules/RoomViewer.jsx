import { useState } from 'react';

/**
 * Room Viewer Component
 * Renders SVG room template with clickable elements
 */
function RoomViewer({ roomTemplate, onElementClick, selectedElementId, elementColors = {} }) {
  const [hoveredElement, setHoveredElement] = useState(null);

  if (!roomTemplate) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Selecteer een ruimte om te beginnen</p>
      </div>
    );
  }

  const handleElementClick = (element) => {
    if (onElementClick) {
      onElementClick(element);
    }
  };

  const getElementColor = (element) => {
    // Use custom color if set, otherwise use default
    return elementColors[element.id] || element.defaultColor;
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{roomTemplate.name}</h3>
        <p className="text-sm text-gray-600">
          Klik op een element om de kleur aan te passen
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-inner">
        <svg
          viewBox={roomTemplate.viewBox}
          className="w-full h-auto"
          style={{ maxHeight: '600px' }}
        >
          {/* Render all room elements */}
          {roomTemplate.elements.map((element) => {
            const isSelected = selectedElementId === element.id;
            const isHovered = hoveredElement === element.id;
            const fillColor = getElementColor(element);

            return (
              <g key={element.id}>
                <path
                  d={element.path}
                  fill={fillColor}
                  stroke={element.stroke || '#333'}
                  strokeWidth={element.strokeWidth || 1}
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    opacity: isSelected || isHovered ? 0.9 : 1,
                    filter: isSelected
                      ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))'
                      : isHovered
                      ? 'brightness(1.1)'
                      : 'none',
                  }}
                  onClick={() => handleElementClick(element)}
                  onMouseEnter={() => setHoveredElement(element.id)}
                  onMouseLeave={() => setHoveredElement(null)}
                />

                {/* Show label on hover */}
                {isHovered && (
                  <text
                    x="400"
                    y="30"
                    textAnchor="middle"
                    className="text-sm font-semibold"
                    fill="#1F2937"
                    style={{ pointerEvents: 'none' }}
                  >
                    {element.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Element Info */}
      {selectedElementId && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Geselecteerd:</strong>{' '}
            {roomTemplate.elements.find((el) => el.id === selectedElementId)?.name}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Kies een kleur uit het palet om toe te passen
          </p>
        </div>
      )}
    </div>
  );
}

export default RoomViewer;
