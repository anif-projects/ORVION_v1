import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, Moon, LogOut, LayoutDashboard, Search, Bell, Menu, X, User,
  BookOpen, Users, Settings, MessageSquare, ShieldAlert, FolderGit2, Calendar, Award,
  Image, ArrowRight, ChevronDown, Briefcase
} from 'lucide-react';
import Logo from './Logo';

// Clean Navigation Component
import api from '../../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLiveHubOpen, setMobileLiveHubOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLiveHubOpen, setIsLiveHubOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const currentHour = new Date().getHours();
      const res = await api.get(`/auth/notifications?clientHour=${currentHour}`);
      if (res.data.status === 'success') {
        setNotifications(res.data.data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLiveHubMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsLiveHubOpen(true);
  };

  const handleLiveHubMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsLiveHubOpen(false);
    }, 150);
  };

  const handleGalleryClick = (e) => {
    setIsLiveHubOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname === '/live-hub') {
      e.preventDefault();
      if (window.location.hash !== '#highlights') {
        window.history.pushState(null, '', '/live-hub#highlights');
      }
      const el = document.getElementById('highlights');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Check if current route is inside Student or Admin portal
  const isPortalRoute = location.pathname === '/student' || location.pathname.startsWith('/student/') || location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const isLoggedInOrPortal = Boolean(user) || isPortalRoute;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  const publicNavLinks = [
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Internships', path: '/internships' },
    { name: 'Live Hub', path: '/live-hub' },
  ];

  const studentPortalLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/student/my-courses', icon: BookOpen },
    { name: 'My Events', path: '/student/events', icon: Calendar },
    { name: 'Certifications', path: '/student/certifications', icon: Award },
    { name: 'Profile', path: '/student/profile', icon: User },
  ];

  const adminPortalLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Course Manager', path: '/admin/courses', icon: BookOpen },
    { name: 'Live Events', path: '/admin/events', icon: Calendar },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Internships', path: '/admin/internships', icon: Briefcase },
    { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
  ];

  const portalLinks = isAdmin ? adminPortalLinks : studentPortalLinks;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-3 z-50 w-full px-3 sm:px-6 max-w-7xl mx-auto transition-all mb-4 sm:mb-6 relative"
    >
      {/* True Glassmorphism Floating Container */}
      <div 
        className="rounded-full px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300 select-none"
        style={{
          background: scrolled
            ? (darkMode ? 'rgba(15, 23, 42, 0.65)' : 'rgba(255, 255, 255, 0.22)')
            : (darkMode ? 'rgba(15, 23, 42, 0.35)' : 'rgba(255, 255, 255, 0.10)'),
          backdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'blur(28px) saturate(180%)',
          border: darkMode
            ? (scrolled ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(255, 255, 255, 0.12)')
            : (scrolled ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.22)'),
          boxShadow: scrolled
            ? '0 12px 40px rgba(15, 23, 42, 0.12)'
            : '0 10px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        
        {/* Logo */}
        <Link to="/" className="flex items-center group py-1 pl-1 shrink-0">
          <Logo className="h-9 sm:h-10 w-auto transition-transform group-hover:scale-105" />
        </Link>

        {/* Center Nav Links Capsule */}
        {!isPortalRoute && (
          <nav 
            className="hidden lg:flex items-center gap-1 p-1.5 rounded-full transition-all duration-300"
            style={{
              background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(255, 255, 255, 0.20)',
            }}
          >
            {publicNavLinks.map((link) => {
              const isLiveHub = link.name === 'Live Hub';

              if (isLiveHub) {
                return (
                  <div
                    key={link.path}
                    onMouseEnter={handleLiveHubMouseEnter}
                    onMouseLeave={handleLiveHubMouseLeave}
                    className="relative"
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1 ${
                          isActive || isLiveHubOpen
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/10'
                        }`
                      }
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLiveHubOpen ? 'rotate-180' : ''}`} />
                    </NavLink>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/10'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        )}

        {/* Compact Glass Search Bar (Desktop) - Hide in portal */}
        {!isPortalRoute && (
          <div className="hidden xl:flex items-center relative w-48 xl:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full text-slate-800 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200"
              style={{
                background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(255, 255, 255, 0.20)',
              }}
            />
          </div>
        )}

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Portal Controls (Hidden on mobile < md to prevent layout overflow) */}
          {isLoggedInOrPortal ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2.5 rounded-full text-slate-700 dark:text-slate-200 transition relative"
                  style={{
                    background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(255, 255, 255, 0.20)',
                  }}
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#f97316] animate-pulse"></span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl p-4 shadow-2xl z-50 border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">Notifications</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setNotifications([])}
                          className="text-[10px] font-bold text-[#b45309] hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 text-xs font-bold pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-slate-500 text-center py-4 font-semibold">No new notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-150 dark:border-slate-800 space-y-1 text-left">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-white">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pl-2 border-l border-white/20 dark:border-white/10">
                <Link
                  to={user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : '/student/dashboard'}
                  className="text-xs font-bold text-slate-800 dark:text-white max-w-[120px] truncate hover:text-[#D97706] dark:hover:text-amber-400 transition-colors"
                >
                  {user?.name || 'Student'}
                </Link>
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
            /* Public Log in Button (Kept Exactly the Same) */
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-sm hover:scale-105 transition-all"
              >
                Log in
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full text-slate-700 dark:text-slate-200 transition shrink-0"
            style={{
              background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.10)' : '1px solid rgba(255, 255, 255, 0.20)',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Live Hub Premium 4-Column Mega Menu Dropdown */}
      {!isPortalRoute && (
        <div
          onMouseEnter={handleLiveHubMouseEnter}
          onMouseLeave={handleLiveHubMouseLeave}
          className={`hidden lg:block absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[960px] max-w-[95vw] rounded-[24px] p-6 transition-all duration-250 ease-out z-50 select-none ${
            isLiveHubOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto shadow-[0_20px_50px_rgba(15,23,42,0.12)]'
              : 'opacity-0 -translate-y-3 pointer-events-none shadow-none'
          }`}
          style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(15, 23, 42, 0.06)',
          }}
        >
          <div className="grid grid-cols-12 gap-6">
            {/* COLUMN 1: Large Title & Description */}
            <div className="col-span-6 rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/15 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D97706]">Orvion Live</span>
                <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight mt-1">Live Hub</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 font-medium">
                  Stay connected with our latest events, webinars, workshops and community activities.
                </p>
              </div>
              <Link
                to="/live-hub"
                onClick={() => setIsLiveHubOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97706] text-white text-xs font-bold shadow-md hover:bg-amber-700 transition-all duration-200 mt-6 w-fit group/btn"
              >
                <span>Explore Live Hub</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>

            {/* COLUMN 2: Navigation Options */}
            <div className="col-span-6 space-y-1">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
                Explore
              </h4>
              
              <Link
                to="/live-hub"
                onClick={() => setIsLiveHubOpen(false)}
                className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border-l-2 border-transparent hover:border-[#D97706] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/60"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-[#D97706] shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#D97706] transition-colors">
                      Live Events
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D97706] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    Join upcoming offline & online events.
                  </p>
                </div>
              </Link>

              <Link
                to="/live-hub#highlights"
                onClick={handleGalleryClick}
                className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border-l-2 border-transparent hover:border-[#D97706] hover:bg-[#F8FAFC] dark:hover:bg-slate-800/60"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-[#D97706] shrink-0 mt-0.5">
                  <Image className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#D97706] transition-colors">
                      Gallery
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D97706] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                    Explore photos and highlights from our events.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Drawer (Clean Frosted Glass Overlay) */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden mt-2 p-4 rounded-3xl space-y-4 shadow-2xl transition-all duration-300"
          style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          {/* Navigation Links in Mobile Drawer */}
          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isLoggedInOrPortal ? (isAdmin ? 'Admin Navigation' : 'Student Navigation') : 'Public Menu'}
            </div>

            {(isPortalRoute ? portalLinks : publicNavLinks).map((link) => {
              const isLiveHub = link.name === 'Live Hub';

              if (!isLoggedInOrPortal && isLiveHub) {
                return (
                  <div key={link.path} className="flex flex-col gap-1">
                    <button
                      onClick={() => setMobileLiveHubOpen(!mobileLiveHubOpen)}
                      className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <span>Live Hub</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${mobileLiveHubOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {mobileLiveHubOpen && (
                      <div className="pl-6 space-y-1 py-1">
                        <Link to="/live-hub" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:text-[#D97706]">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>Live Events</span>
                        </Link>
                        <Link to="/live-hub#highlights" onClick={handleGalleryClick} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:text-[#D97706]">
                          <Image className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>Gallery</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

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
                        : 'text-slate-800 dark:text-slate-200 hover:bg-white/40 dark:hover:bg-white/10'
                    }`
                  }
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/20 dark:border-white/10 space-y-3">
            {/* User Badge if Logged In */}
            {isLoggedInOrPortal && (
              <Link
                to={user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' : '/student/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all w-full"
              >
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {(user?.name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'student@lms.com'}</p>
                </div>
              </Link>
            )}

            {/* Logout / Login Actions */}
            <div className="flex items-center justify-end pt-1 gap-2">
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
    </motion.header>
  );
}
