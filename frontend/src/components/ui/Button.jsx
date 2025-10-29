/**
 * Reusable Button component with different variants
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'outline'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {ReactNode} children - Button content
 * @param {Function} onClick - Click handler
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional CSS classes
 */
function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-gray-400',
    secondary:
      'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 disabled:bg-gray-400',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-gray-400 disabled:text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
