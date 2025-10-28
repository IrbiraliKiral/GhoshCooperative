import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUniversity, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { appConfig } from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/common/LanguageToggle/LanguageToggle';
import { getCurrentMachineSession } from '@/services/sessionService';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is logged in and get their name
    const session = getCurrentMachineSession();
    if (session) {
      setUserName(session.memberName);
    }
  }, []);

  return (
    <header className="bg-white shadow-banking-md sticky top-0 z-50">
      <div className="banking-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <FaUniversity className="text-banking-blue-600 text-2xl" />
            <span className="font-display font-bold text-xl text-banking-gray-900">
              {appConfig.bankName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link 
              to="/" 
              className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors"
            >
              {t.header.home}
            </Link>
            <Link 
              to="/members" 
              className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors"
            >
              {t.header.members}
            </Link>
            <Link 
              to="/learn-more" 
              className="text-banking-gray-700 hover:text-banking-blue-600 font-medium transition-colors"
            >
              {t.header.learnMore}
            </Link>
            <LanguageToggle />
            {userName && (
              <div className="flex items-center gap-2 pl-4 border-l border-banking-gray-200">
                <FaUserCircle className="text-banking-blue-600 text-2xl" />
                <span className="text-banking-gray-900 font-medium">{userName}</span>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-banking-gray-700 hover:text-banking-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-banking-gray-200 animate-in slide-in-from-top">
            <Link
              to="/"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600 hover:bg-banking-blue-50 px-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.header.home}
            </Link>
            <Link
              to="/members"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600 hover:bg-banking-blue-50 px-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.header.members}
            </Link>
            <Link
              to="/learn-more"
              className="block py-2 text-banking-gray-700 hover:text-banking-blue-600 hover:bg-banking-blue-50 px-2 rounded transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.header.learnMore}
            </Link>
            <div className="px-2 py-2">
              <LanguageToggle />
            </div>
            {userName && (
              <div className="flex items-center gap-2 px-2 py-2 mt-2 border-t border-banking-gray-200">
                <FaUserCircle className="text-banking-blue-600 text-2xl" />
                <span className="text-banking-gray-900 font-medium">{userName}</span>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
