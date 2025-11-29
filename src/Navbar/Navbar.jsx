import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Navigation items with direct labels (no nested keys)
  const navItems = [
    { path: '/', labelEn: 'Home', labelAr: 'الرئيسية' },
    { path: '/quantum-computing', labelEn: 'Quantum Computing', labelAr: 'الحوسبة الكمية' },
    { path: '/how-to-play', labelEn: 'How to Play', labelAr: 'كيف تلعب' },
    { path: '/game', labelEn: 'Play Game', labelAr: 'العب الآن' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => handleNavigation('/')}>
          <span className="logo-icon">Q</span>
          <span className="logo-text">{t('title')}</span>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                {language === 'en' ? item.labelEn : item.labelAr}
              </button>
            </li>
          ))}
        </ul>

        {/* Language Switcher */}
        <button 
          className="language-btn"
          onClick={toggleLanguage}
        >
          <span className="lang-text">
            {language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>

        {/* Menu Toggle Button (Mobile) */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {language === 'en' ? item.labelEn : item.labelAr}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;