import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import { supabase } from '../lib/supabase';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/use-cases', label: 'Use Cases' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing', disabled: true },
  ];

  const privateLinks = [
    ...publicLinks,
    { path: '/my-assistant', label: 'My AI Assistant' },
  ];

  const navLinks = isAuthenticated ? privateLinks : publicLinks;

  return (
    <nav className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/flixby-logo.png" 
                alt="Flixby Logo" 
                className="h-8 w-auto"
              />
              <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md text-xs font-medium">
                Beta
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="flex items-baseline space-x-4">
              {navLinks.map(({ path, label, disabled }) => (
                <div
                  key={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    disabled
                      ? 'text-gray-500 cursor-not-allowed'
                      : isActive(path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!disabled) {
                      navigate(path);
                    }
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <AuthButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(({ path, label, disabled }) => (
              <div
                key={path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : isActive(path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer'
                }`}
                onClick={() => {
                  if (!disabled) {
                    navigate(path);
                    setIsOpen(false);
                  }
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;