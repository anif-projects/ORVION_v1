import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 pt-2 sm:pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
