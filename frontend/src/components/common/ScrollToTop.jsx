import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Guarantees every page load, route change, browser refresh (F5 / Ctrl + R),
 * direct URL entry, and browser Back/Forward navigation starts at scrollY = 0 instantly.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  const resetScroll = () => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // Run before DOM paint on every route location change
  useLayoutEffect(() => {
    resetScroll();
  }, [pathname, search, hash]);

  // Handle browser popstate (Back/Forward), pageshow (Refresh/Restore), and initial mount
  useEffect(() => {
    resetScroll();

    const handlePopState = () => resetScroll();
    const handlePageShow = () => resetScroll();

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return null;
}
