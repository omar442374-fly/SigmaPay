import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

/**
 * Main layout component that includes the Navbar and wraps all pages
 * This layout is used for both public and protected routes
 */
function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
