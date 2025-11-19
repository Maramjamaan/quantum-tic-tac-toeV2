import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Navbar.css';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setExpandedSection(null);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <span className="logo-icon">Q</span>
          <span className="logo-text">{t('title')}</span>
        </div>

        {/* Menu Toggle Button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>

        {/* Language Switcher */}
        <button 
          className="language-btn"
          onClick={toggleLanguage}
        >
          <span className="lang-icon">🌐</span>
          <span className="lang-text">
            {language === 'en' ? 'العربية' : 'English'}
          </span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="navbar-menu">
          {/* About Section */}
          <div className="menu-section">
            <button 
              className={`section-header ${expandedSection === 'about' ? 'active' : ''}`}
              onClick={() => toggleSection('about')}
            >
              <span>{t('navbar.about.title')}</span>
              <span className="arrow">{expandedSection === 'about' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'about' && (
              <div className="section-content">
                <p>{t('navbar.about.description')}</p>
                <ul>
                  <li>
                    <strong>{t('navbar.about.superposition')}</strong>
                    <p>{t('navbar.about.superpositionDesc')}</p>
                  </li>
                  <li>
                    <strong>{t('navbar.about.entanglement')}</strong>
                    <p>{t('navbar.about.entanglementDesc')}</p>
                  </li>
                  <li>
                    <strong>{t('navbar.about.collapse')}</strong>
                    <p>{t('navbar.about.collapseDesc')}</p>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* How to Play Section */}
          <div className="menu-section">
            <button 
              className={`section-header ${expandedSection === 'howto' ? 'active' : ''}`}
              onClick={() => toggleSection('howto')}
            >
              <span>{t('navbar.howToPlay.title')}</span>
              <span className="arrow">{expandedSection === 'howto' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'howto' && (
              <div className="section-content">
                <ol>
                  <li>{t('navbar.howToPlay.step1')}</li>
                  <li>{t('navbar.howToPlay.step2')}</li>
                  <li>{t('navbar.howToPlay.step3')}</li>
                  <li>{t('navbar.howToPlay.step4')}</li>
                </ol>
              </div>
            )}
          </div>

          {/* Rules Section */}
          <div className="menu-section">
            <button 
              className={`section-header ${expandedSection === 'rules' ? 'active' : ''}`}
              onClick={() => toggleSection('rules')}
            >
              <span>{t('navbar.rules.title')}</span>
              <span className="arrow">{expandedSection === 'rules' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'rules' && (
              <div className="section-content">
                <ul>
                  <li>{t('navbar.rules.rule1')}</li>
                  <li>{t('navbar.rules.rule2')}</li>
                  <li>{t('navbar.rules.rule3')}</li>
                  <li>{t('navbar.rules.rule4')}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;