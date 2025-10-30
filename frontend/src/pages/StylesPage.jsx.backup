import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import StyleGrid from '../components/modules/StyleGrid';
import StyleDetailPanel from '../components/modules/StyleDetailPanel';
import { interiorStyles } from '../data/styles';

/**
 * Main page for browsing interior styles
 * Displays a grid of style cards and detailed panel on click
 */
function StylesPage() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter styles based on search query
  const filteredStyles = useMemo(() => {
    if (!searchQuery.trim()) return interiorStyles;

    const query = searchQuery.toLowerCase();
    return interiorStyles.filter(
      (style) =>
        style.name.toLowerCase().includes(query) ||
        style.description.toLowerCase().includes(query) ||
        style.materials.some((m) => m.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Small delay before clearing to allow panel to close smoothly
    setTimeout(() => setSelectedStyle(null), 300);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ontdek Interieurstijlen
        </h1>
        <p className="text-gray-600 mb-6">
          Kies een stijl die bij je past en laat je inspireren
        </p>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Zoek stijlen, materialen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button - Placeholder */}
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredStyles.length} {filteredStyles.length === 1 ? 'stijl' : 'stijlen'}{' '}
          gevonden
        </div>
      )}

      {/* Styles Grid */}
      <StyleGrid
        styles={filteredStyles}
        onStyleClick={handleStyleClick}
        selectedStyleId={selectedStyle?.id}
      />

      {/* No Results */}
      {filteredStyles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Geen stijlen gevonden voor "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Wis zoekfilter
          </button>
        </div>
      )}

      {/* Detail Panel */}
      <StyleDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        style={selectedStyle}
      />
    </div>
  );
}

export default StylesPage;
