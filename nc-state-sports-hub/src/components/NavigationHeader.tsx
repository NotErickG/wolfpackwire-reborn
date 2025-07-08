
import React, { useState } from 'react';
import Link from 'next/link';

interface NavigationHeaderProps {
  currentPage?: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Schedule', href: '/schedule' },
    { name: 'Roster', href: '/roster' },
    { name: 'News', href: '/news' },
    { name: 'Stats', href: '/stats' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-nc-red shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between" aria-label="Main Navigation">
        {/* NC State Logo Area */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center" aria-label="NC State Sports Hub Home">
            {/* Replace with actual NC State logo */}
            <span className="text-white text-2xl font-bold">NC State</span>
          </Link>
        </div>

        {/* Main Navigation - Desktop */}
        <ul className="hidden md:flex space-x-8" role="menubar">
          {navItems.map((item) => (
            <li key={item.name} role="none">
              <Link
                href={item.href}
                className={`text-white hover:text-nc-red-dark transition-colors duration-200
                  ${currentPage === item.name.toLowerCase() ? 'font-bold border-b-2 border-white' : ''}`}
                aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
                role="menuitem"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search Icon & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-nc-red-dark focus:outline-none focus:ring-2 focus:ring-white" aria-label="Search">
            {/* Replace with actual search icon (e.g., SVG) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>

          <button
            className="md:hidden text-white hover:text-nc-red-dark focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            {/* Hamburger Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-nc-red shadow-lg py-2">
            <ul role="menubar">
              {navItems.map((item) => (
                <li key={item.name} role="none">
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 text-white hover:bg-nc-red-dark transition-colors duration-200
                      ${currentPage === item.name.toLowerCase() ? 'font-bold bg-nc-red-dark' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
                    role="menuitem"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavigationHeader;
