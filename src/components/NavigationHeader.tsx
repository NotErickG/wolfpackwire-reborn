import React, { useState } from 'react';

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
    <header className="sticky top-0 z-50 bg-[#CC0000] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center space-x-2" aria-label="NC State Sports Hub Home">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-[#CC0000] text-xl">NC</span>
              </div>
              <span className="text-white text-xl font-semibold hidden sm:block">Wolfpack Wire</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                  ${currentPage === item.name.toLowerCase()
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-200 hover:border-gray-300 hover:text-white'
                  }`}
                aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Search Button and Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Search"
            >
              {/* Search Icon (simple SVG for demonstration) */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2 p-2 rounded-md text-gray-200 hover:text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              aria-label="Toggle mobile menu"
            >
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Search Button (hidden on mobile) */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Search"
            >
              {/* Search Icon */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium
                ${currentPage === item.name.toLowerCase()
                  ? 'bg-red-700 text-white'
                  : 'text-gray-200 hover:bg-red-700 hover:text-white'
                }`}
              aria-current={currentPage === item.name.toLowerCase() ? 'page' : undefined}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
