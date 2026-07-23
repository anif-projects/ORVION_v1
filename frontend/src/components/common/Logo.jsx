import React from 'react';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo-dark.png';

export default function Logo({ className = "h-11 w-auto", alt = "ORVION - Unlock The Future" }) {
  return (
    <div className="flex items-center select-none">
      {/* Light mode logo */}
      <img
        src={logoLight}
        alt={alt}
        className={`${className} object-contain dark:hidden transition-opacity duration-300 hover:opacity-95`}
        loading="eager"
        decoding="async"
      />
      {/* Dark mode logo */}
      <img
        src={logoDark}
        alt={alt}
        className={`${className} object-contain hidden dark:block transition-opacity duration-300 hover:opacity-95`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
