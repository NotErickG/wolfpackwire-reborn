"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';

interface NavigationHeaderProps {
  currentPage?: string;
}

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Roster', href: '/roster' },
  { name: 'News', href: '/news' },
  { name: 'Stats', href: '/stats' },
];

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#CC0000] shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center" aria-label="NC State Sports Hub Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#CC0000] font-bold text-xl">
              NC
            </div>
            <span className="ml-3 text-white text-2xl font-bold hidden md:block">Wolfpack Wire</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8" aria-label="Main Navigation">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-white text-lg font-semibold transition-colors duration-300 hover:text-gray-200
                ${currentPage === item.name.toLowerCase() ? 'border-b-2 border-white' : ''}`}
              aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button & Search Icon */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            onClick={() => alert('Search functionality coming soon!')}
            className="text-white text-xl focus:outline-none"
            aria-label="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="text-white text-xl focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Search Icon */}
        <div className="hidden md:block">
          <button
            onClick={() => alert('Search functionality coming soon!')}
            className="text-white text-xl focus:outline-none hover:text-gray-200 transition-colors duration-300"
            aria-label="Search"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#CC0000] pb-4">
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col items-center space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={toggleMobileMenu} // Close menu on item click
                    className={`block text-white text-lg font-semibold py-2 px-4 rounded-md transition-colors duration-300 hover:bg-white hover:text-[#CC0000]
                      ${currentPage === item.name.toLowerCase() ? 'bg-white text-[#CC0000]' : ''}`}
                    aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationHeader;