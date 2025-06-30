import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '@/components/organisms/BottomNavigation';

const Layout = ({ userRole, currentUser, onResetRole }) => {
  const location = useLocation();
  const isFullScreenPage = location.pathname.startsWith('/chat/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-gray-800 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute top-40 -right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-accent-500/20 rounded-full blur-2xl animate-bounce-gentle"></div>
      </div>

      {/* Main Content */}
      <main className={`relative z-10 ${isFullScreenPage ? 'h-screen' : 'pb-20'}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!isFullScreenPage && (
        <BottomNavigation userRole={userRole} currentUser={currentUser} onResetRole={onResetRole} />
      )}
    </div>
  );
};

export default Layout;