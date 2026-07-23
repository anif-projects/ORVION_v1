import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube, ShieldCheck, Heart } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/90 dark:border-slate-800/90 bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md pt-12 sm:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center sm:text-left">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <Logo className="h-10 sm:h-11 w-auto" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Empowering engineers and students with production-grade interactive learning, live workshops, and verifiable credentials.
            </p>
          </div>

          {/* Column 2: Navigation & Explore */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Course Catalog
                </Link>
              </li>
              <li>
                <Link to="/live-events" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Live Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Verification */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/verify-certificate/DEMO" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center sm:justify-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <span>Verify Certificate</span>
                </Link>
              </li>
              <li>
                <Link to="/student/community" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Community Q&A
                </Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect & Social */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              Connect With Us
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join our community of global developers.
            </p>
            <div className="flex gap-2.5 text-slate-600 dark:text-slate-300">
              <a
                href="#"
                aria-label="GitHub"
                className="p-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all hover:scale-110"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="p-2.5 rounded-full bg-slate-200/80 dark:bg-slate-800/80 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
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
            </div>
          </div>
        </div>

        {/* Bottom Responsive Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 ORVION - Unlock The Future. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-accent-danger fill-accent-danger" /> for learners worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
