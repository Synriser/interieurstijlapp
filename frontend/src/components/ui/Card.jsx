/**
 * Reusable Card component for content containers
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {Function} onClick - Optional click handler for clickable cards
 * @param {boolean} hover - Enable hover effect
 */
function Card({ children, className = '', onClick, hover = false }) {
  const baseClasses = 'bg-white rounded-lg shadow-md overflow-hidden';
  const hoverClasses = hover
    ? 'transition-transform hover:scale-105 hover:shadow-lg cursor-pointer'
    : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
