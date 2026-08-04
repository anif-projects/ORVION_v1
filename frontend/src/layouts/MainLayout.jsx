import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

