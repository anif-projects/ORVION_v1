import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 gap-6 pt-2 sm:pt-4">
        <Sidebar role="student" />
        <main className="flex-1 p-2 sm:p-6 overflow-y-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
