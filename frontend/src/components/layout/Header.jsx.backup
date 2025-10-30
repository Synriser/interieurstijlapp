import { Link, useLocation } from 'react-router-dom';
import { Home, Edit, Image } from 'lucide-react';

/**
 * Header navigation component
 * Shows navigation links with active state
 */
function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Stijlen', icon: Home },
    { path: '/editor', label: 'Editor', icon: Edit },
    { path: '/visualisatie', label: 'Visualisatie', icon: Image },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-700">
              Interieurstijl App
            </h1>
          </div>

          <nav className="flex space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
