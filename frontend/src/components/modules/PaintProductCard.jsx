import { ShoppingCart, Info } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Paint Product Card Component
 * Displays a paint product with color, brand, and details
 */
function PaintProductCard({ product, onSelect, isSelected = false }) {
  const formatPrice = (price) => {
    if (!price) return null;
    return `€${price.toFixed(2)}`;
  };

  const calculateCoverage = (coverage, liters = 1) => {
    return `${coverage * liters}m²`;
  };

  return (
    <div
      className={`relative bg-white rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-primary-600 shadow-lg'
          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
      }`}
    >
      {/* Popular Badge */}
      {product.popular && (
        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
          Populair
        </div>
      )}

      {/* Color Preview */}
      <div className="relative h-32 rounded-t-lg overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: product.hexColor }}
        />
        {/* Color Code Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <p className="text-white font-mono text-sm font-semibold">
            {product.hexColor}
          </p>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand & Name */}
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
            {product.brand}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mt-1">
            {product.colorName}
          </h3>
          <p className="text-sm text-gray-500">{product.colorCode}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Afwerking:</span>
            <p className="font-medium text-gray-900">{product.finish}</p>
          </div>
          <div>
            <span className="text-gray-500">Dekking:</span>
            <p className="font-medium text-gray-900">
              {calculateCoverage(product.coverage)}
            </p>
          </div>
        </div>

        {/* Product Line */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {product.productLine} • {product.type}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2">
          {product.price ? (
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>
              <p className="text-xs text-gray-500">per liter</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Prijs op aanvraag</p>
            </div>
          )}

          <div className="flex gap-2">
            {onSelect && (
              <Button
                size="sm"
                variant={isSelected ? 'primary' : 'outline'}
                onClick={() => onSelect(product)}
              >
                {isSelected ? 'Geselecteerd' : 'Selecteer'}
              </Button>
            )}
          </div>
        </div>

        {/* Match Score (if provided) */}
        {product.matchScore !== undefined && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Match</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${product.matchScore}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {Math.round(product.matchScore)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
          <p className="text-gray-600 font-semibold">Niet op voorraad</p>
        </div>
      )}
    </div>
  );
}

export default PaintProductCard;
