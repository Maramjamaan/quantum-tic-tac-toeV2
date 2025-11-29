import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Floating Quantum Particles Background */}
      <div className="particles-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Main Content */}
      <div className="home-content">
        {/* Quantum Atom Animation */}
        <div className="quantum-atom">
          <div className="nucleus"></div>
          <div className="orbit orbit-1">
            <div className="electron"></div>
          </div>
          <div className="orbit orbit-2">
            <div className="electron"></div>
          </div>
          <div className="orbit orbit-3">
            <div className="electron"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="home-title">
          <span className="title-quantum">{t('home.titleQuantum')}</span>
          <span className="title-world">{t('home.titleWorld')}</span>
        </h1>

        {/* Subtitle */}
        <p className="home-subtitle">
          {t('home.subtitle')}
        </p>

        {/* Play Button */}
        <button 
          className="play-button"
          onClick={() => navigate('/game')}
        >
          <span className="play-text">
            {t('home.playButton')}
          </span>
          <span className="play-arrow">→</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;