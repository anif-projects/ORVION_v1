import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, MapPin, Linkedin, Youtube, Instagram } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const location = useLocation();

  const handleAboutClick = (e) => {
    if (location.pathname === '/about') {
      e.preventDefault();
      if (window.location.hash) {
        window.history.pushState(null, '', '/about');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    if (location.pathname === '/about') {
      e.preventDefault();
      if (window.location.hash !== '#contact') {
        window.history.pushState(null, '', '/about#contact');
      }
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md pt-12 sm:pt-16 pb-8">
      {/* Refined Background Typography Watermark (Shifted 40-60px downward, full word visibility, 1.5px blur, 5% opacity) */}
      <div className="absolute inset-0 flex items-center justify-center translate-y-12 sm:translate-y-14 lg:translate-y-16 pointer-events-none select-none z-0 overflow-hidden px-4">
        <span className="font-serif font-bold text-[90px] sm:text-[160px] md:text-[220px] lg:text-[270px] xl:text-[290px] tracking-[6px] sm:tracking-[10px] leading-none text-slate-900/[0.05] dark:text-white/[0.05] uppercase whitespace-nowrap blur-[1.5px]">
          ORVION
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center sm:text-left">
          
          {/* Brand & Mission Description */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <Logo className="h-10 sm:h-11 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering the next generation of tech professionals with world-class education and career opportunities.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-2.5 pt-1 text-slate-600 dark:text-slate-300">
              <a
                href="#"
                aria-label="LinkedIn"
                className="p-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="p-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all hover:scale-110"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/orvionlearn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-[#E1306C] hover:text-white dark:hover:bg-[#E1306C] transition-all hover:scale-110"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link
                  to="/about"
                  onClick={handleAboutClick}
                  className="inline-block hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:translate-x-[3px] transition-all duration-250 ease-out cursor-pointer"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="inline-block hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:translate-x-[3px] transition-all duration-250 ease-out cursor-pointer"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/internships"
                  className="inline-block hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:translate-x-[3px] transition-all duration-250 ease-out cursor-pointer"
                >
                  Internships
                </Link>
              </li>
              <li>
                <Link
                  to="/live-hub"
                  className="inline-block hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:translate-x-[3px] transition-all duration-250 ease-out cursor-pointer"
                >
                  Live Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/about#contact"
                  onClick={handleContactClick}
                  className="inline-block hover:text-[#D97706] dark:hover:text-[#F59E0B] hover:translate-x-[3px] transition-all duration-250 ease-out cursor-pointer"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Offline Courses */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Offline Courses
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/courses?type=offline" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link to="/courses?type=offline" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses?type=offline" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link to="/courses?type=offline" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  UI/UX Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <a href="mailto:info@orvionlearn.co.in" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  info@orvionlearn.co.in
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <span>Ongole, Andhra Pradesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 Orvion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
