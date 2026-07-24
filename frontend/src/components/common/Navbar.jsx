import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, Moon, LogOut, LayoutDashboard, Search, Bell, Menu, X, User,
  BookOpen, Users, Settings, MessageSquare, ShieldAlert, FolderGit2, Calendar, Award
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current route is inside Student or Admin portal
  const isPortalRoute = location.pathname.startsWith('/student') || location.pathname.startsWith('/admin');
  const isLoggedInOrPortal = Boolean(user) || isPortalRoute;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || location.pathname.startsWith('/admin');

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Live Events', path: '/live-events' },
  ];

  const studentPortalLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/my-courses', icon: BookOpen },
    { name: 'My Events', path: '/student/events', icon: Calendar },
    { name: 'Certifications', path: '/student/certifications', icon: Award },
    { name: 'Community Q&A', path: '/student/community', icon: MessageSquare },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminPortalLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Course Manager', path: '/admin/courses', icon: BookOpen },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
  ];

  const portalLinks = isAdmin ? adminPortalLinks : studentPortalLinks;

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 max-w-7xl mx-auto transition-all">
      <div className="backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/90 dark:border-slate-800/90 rounded-full shadow-lg shadow-slate-900/5 px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center group py-1 pl-1 shrink-0">
          <Logo className="h-9 sm:h-10 w-auto transition-transform group-hover:scale-105" />
        </Link>

        {/* Center Nav Links (ONLY rendered on public pages when NOT in portal) */}
        {!isLoggedInOrPortal && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/70 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            {publicNavLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/60'
                  }`
                }
              >
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        )}

        {/* Compact Search Bar (Desktop) - Hide in portal */}
        {!isLoggedInOrPortal && (
          <div className="hidden xl:flex items-center relative w-48 xl:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition"
            />
          </div>
        )}

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button (Desktop & Tablet) */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition hover:scale-105"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Portal Controls (Hidden on mobile < md to prevent layout overflow) */}
          {isLoggedInOrPortal ? (
            <div className="hidden md:flex items-center gap-2">
              <button className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-500"></span>
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-white max-w-[120px] truncate">
                  {user?.name || 'Student'}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-accent-danger transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Public Log in Button (Desktop only) */
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-sm hover:scale-105 transition-all"
              >
                Log in
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button (Visible on mobile < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean Responsive Overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          
          {/* Navigation Links in Mobile Drawer */}
          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              {isLoggedInOrPortal ? (isAdmin ? 'Admin Navigation' : 'Student Navigation') : 'Public Menu'}
            </div>

            {(isLoggedInOrPortal ? portalLinks : publicNavLinks).map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  end={link.path === '/' || link.path === '/admin'}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-3 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* User Badge if Logged In */}
            {isLoggedInOrPortal && (
              <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                  {(user?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email || 'student@lms.com'}</p>
                </div>
              </div>
            )}

            {/* Theme Toggle & Logout / Login Actions */}
            <div className="flex items-center justify-between pt-1 gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              {isLoggedInOrPortal ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-red-500/10 text-accent-danger text-xs font-bold hover:bg-red-500/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-sm"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
