import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import QuantumLogo from '../../components/QuantumLogo';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="home-page">
      <Navbar />

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

      <div className="home-content">
        <QuantumLogo size={220} />

        <div className="home-eyebrow">
          {isAr ? 'مشروع تخرج' : 'Graduation Project'}
        </div>

        <h1 className="home-title">
          {isAr
            ? <><em>إكس-أو</em>{' الكمية'}</>
            : <>{'Quantum '}<em>Tic-Tac-Toe</em></>
          }
        </h1>

        <p className="home-subtitle">
          {isAr
            ? 'أداة تعليمية تُجسّد مفاهيم الحوسبة الكمية التقنية التي ستُعيد تعريف المستحيل'
            : 'A learning tool that makes quantum computing tangible the technology that will redefine the impossible'}
        </p>

        <button className="home-play-btn" onClick={() => navigate('/quantum-computing')}>
          {isAr ? 'ابدأ من هنا' : 'Start Here'}
          <span className="home-play-arrow">←</span>
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;