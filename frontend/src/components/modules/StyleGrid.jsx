import StyleCard from './StyleCard';

/**
 * Grid layout for displaying multiple style cards
 * Responsive: 2 columns on mobile, 4 columns on desktop
 * @param {Array} styles - Array of style objects
 * @param {Function} onStyleClick - Handler for style card clicks
 * @param {string} selectedStyleId - ID of currently selected style
 */
function StyleGrid({ styles, onStyleClick, selectedStyleId = null }) {
  if (!styles || styles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Geen stijlen gevonden</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {styles.map((style) => (
        <StyleCard
          key={style.id}
          style={style}
          onClick={() => onStyleClick(style)}
          isSelected={style.id === selectedStyleId}
        />
      ))}
    </div>
  );
}

export default StyleGrid;
