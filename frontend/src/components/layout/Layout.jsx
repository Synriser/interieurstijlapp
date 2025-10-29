import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * Main layout component that wraps all pages
 * Includes header and main content area
 */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
