import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBars, FaTimes, FaCar, FaTimesCircle, FaUser, FaSignOutAlt, FaTachometerAlt, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Scroll effect to add background styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      // Route query to buy page as search
      navigate(`/buy?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/rent', label: 'Rent Cars' },
    { path: '/buy', label: 'Buy Cars' },
    { path: '/sell', label: 'Sell Car' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 shadow-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12 duration-300 shadow-md shadow-blue-500/20">
              <FaCar className="text-xl" />
            </div>
            <span className="text-2xl font-black font-display tracking-tight text-slate-900">
              Imperial<span className="text-blue-600"> Wheels</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide hover:text-blue-600 transition-colors duration-200 relative py-1 ${
                    isActive ? 'text-blue-600 after:w-full' : 'text-slate-600'
                  } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full ${
                    !isActive && 'after:w-0'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors duration-200"
              aria-label="Search cars"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Profile / Login Button */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xs font-black">
                    {user.avatar || user.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0]}</span>
                  <FaChevronDown className="text-slate-400 text-[10px]" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-50">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
                      </div>
                      
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2.5 transition-colors"
                        >
                          <FaTachometerAlt className="text-slate-400 text-sm" /> Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2.5 transition-colors"
                        >
                          <FaUser className="text-slate-400 text-sm" /> My Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2.5 transition-colors border-t border-slate-50"
                      >
                        <FaSignOutAlt className="text-red-400 text-sm" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-sm rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Book Now Button */}
            <Link
              to="/rent"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Actions Container */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Search Button for Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
              aria-label="Search"
            >
              <FaSearch className="text-lg" />
            </button>

            {/* Hamburger Menu Toggler */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay Model */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-2xl relative"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-4">Search Used Cars</h3>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type brand or model... (e.g. Porsche, Tesla)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-blue-500/10"
                >
                  Search
                </button>
              </form>
              <div className="mt-4 text-xs text-slate-400">
                Press Enter to search. Try searching "Porsche" or "Audi".
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 w-80 h-full bg-white shadow-2xl flex flex-col p-6 pt-24"
            >
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-bold font-display transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}

                {user && (
                  <>
                    <div className="h-px bg-slate-100 my-2" />
                    {isAdmin ? (
                      <NavLink
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-lg font-bold font-display transition-colors flex items-center gap-2 ${
                            isActive ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                          }`
                        }
                      >
                        <FaTachometerAlt className="text-sm" /> Admin Dashboard
                      </NavLink>
                    ) : (
                      <NavLink
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-lg font-bold font-display transition-colors flex items-center gap-2 ${
                            isActive ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
                          }`
                        }
                      >
                        <FaUser className="text-sm" /> My Profile
                      </NavLink>
                    )}
                  </>
                )}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt className="text-sm" /> Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                
                <Link
                  to="/rent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
