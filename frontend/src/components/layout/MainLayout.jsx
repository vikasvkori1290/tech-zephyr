import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

export const MainLayout = () => {
  const location = useLocation();
  const isGameHome = location.pathname === '/';

  if (isGameHome) {
    return (
      <div className="w-full h-screen overflow-hidden bg-slate-950 select-none">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
