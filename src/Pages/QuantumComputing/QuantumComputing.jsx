import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';
import { 
  Atom, 
  Link, 
  Eye, 
  Monitor, 
  Cpu, 
  Pill, 
  Lock, 
  Bot, 
  Globe, 
  Gamepad2,
  ChevronDown,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import './QuantumComputing.css';

const QuantumComputing = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('superposition');

  return (
    <div className="quantum-computing-page">
      <Navbar />

      {/* Floating Particles */}
      <div className="particles-bg">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      {/* Hero Section */}
      <section className="qc-hero">
        <div className="qc-hero-content">
          <div className="qc-hero-icon">
            <div className="atom-icon">
              <div className="atom-nucleus"></div>
              <div className="atom-orbit atom-orbit-1"><div className="atom-electron"></div></div>
              <div className="atom-orbit atom-orbit-2"><div className="atom-electron"></div></div>
            </div>
          </div>
          <h1 className="qc-hero-title">{t('quantumComputing.hero.title')}</h1>
          <p className="qc-hero-subtitle">{t('quantumComputing.hero.subtitle')}</p>
        </div>
        <div className="scroll-indicator">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* What is Quantum Computing */}
      <section className="qc-section qc-what">
        <div className="qc-container">
          <h2 className="qc-section-title">{t('quantumComputing.what.title')}</h2>
          <div className="qc-what-content">
            <div className="qc-what-visual">
              <div className="quantum-computer-placeholder">
                <Cpu size={64} className="qc-placeholder-icon" />
                <span>{t('quantumComputing.what.imagePlaceholder')}</span>
              </div>
            </div>
            <div className="qc-what-text">
              <p>{t('quantumComputing.what.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Classical vs Quantum */}
      <section className="qc-section qc-comparison">
        <div className="qc-container">
          <h2 className="qc-section-title">{t('quantumComputing.comparison.title')}</h2>
          <div className="comparison-wrapper">
            {/* Classical Side */}
            <div className="comparison-card classical">
              <div className="comparison-header">
                <Monitor size={40} className="comparison-icon" />
                <h3>{t('quantumComputing.comparison.classical.title')}</h3>
              </div>
              <div className="comparison-visual">
                <div className="bit-display">
                  <div className="bit bit-0">0</div>
                  <span className="bit-or">{t('quantumComputing.comparison.or')}</span>
                  <div className="bit bit-1">1</div>
                </div>
              </div>
              <ul className="comparison-list">
                <li>{t('quantumComputing.comparison.classical.point1')}</li>
                <li>{t('quantumComputing.comparison.classical.point2')}</li>
                <li>{t('quantumComputing.comparison.classical.point3')}</li>
              </ul>
            </div>

            {/* VS Divider */}
            <div className="comparison-vs">
              <span><Zap size={24} /></span>
            </div>

            {/* Quantum Side */}
            <div className="comparison-card quantum">
              <div className="comparison-header">
                <Atom size={40} className="comparison-icon" />
                <h3>{t('quantumComputing.comparison.quantum.title')}</h3>
              </div>
              <div className="comparison-visual">
                <div className="qubit-display">
                  <div className="qubit">
                    <span className="qubit-state">0</span>
                    <span className="qubit-plus">+</span>
                    <span className="qubit-state">1</span>
                  </div>
                </div>
              </div>
              <ul className="comparison-list">
                <li>{t('quantumComputing.comparison.quantum.point1')}</li>
                <li>{t('quantumComputing.comparison.quantum.point2')}</li>
                <li>{t('quantumComputing.comparison.quantum.point3')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quantum Principles */}
      <section className="qc-section qc-principles">
        <div className="qc-container">
          <h2 className="qc-section-title">{t('quantumComputing.principles.title')}</h2>
          
          {/* Tabs */}
          <div className="principles-tabs">
            <button 
              className={`principle-tab ${activeTab === 'superposition' ? 'active' : ''}`}
              onClick={() => setActiveTab('superposition')}
            >
              <Sparkles size={20} className="tab-icon" />
              <span className="tab-label">{t('quantumComputing.principles.superposition.title')}</span>
            </button>
            <button 
              className={`principle-tab ${activeTab === 'entanglement' ? 'active' : ''}`}
              onClick={() => setActiveTab('entanglement')}
            >
              <Link size={20} className="tab-icon" />
              <span className="tab-label">{t('quantumComputing.principles.entanglement.title')}</span>
            </button>
            <button 
              className={`principle-tab ${activeTab === 'measurement' ? 'active' : ''}`}
              onClick={() => setActiveTab('measurement')}
            >
              <Eye size={20} className="tab-icon" />
              <span className="tab-label">{t('quantumComputing.principles.measurement.title')}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="principles-content">
            {/* Superposition */}
            {activeTab === 'superposition' && (
              <div className="principle-card">
                <div className="principle-animation superposition-anim">
                  <div className="superposition-demo">
                    <div className="sup-particle">
                      <span>X</span>
                    </div>
                    <div className="sup-positions">
                      <div className="sup-pos sup-pos-1"></div>
                      <div className="sup-pos sup-pos-2"></div>
                    </div>
                  </div>
                </div>
                <p className="principle-description">
                  {t('quantumComputing.principles.superposition.description')}
                </p>
              </div>
            )}

            {/* Entanglement */}
            {activeTab === 'entanglement' && (
              <div className="principle-card">
                <div className="principle-animation entanglement-anim">
                  <div className="entanglement-demo">
                    <div className="ent-particle ent-particle-1">
                      <span>X</span>
                    </div>
                    <div className="ent-link">
                      <div className="ent-line"></div>
                      <Link size={24} className="ent-icon" />
                      <div className="ent-line"></div>
                    </div>
                    <div className="ent-particle ent-particle-2">
                      <span>X</span>
                    </div>
                  </div>
                </div>
                <p className="principle-description">
                  {t('quantumComputing.principles.entanglement.description')}
                </p>
              </div>
            )}

            {/* Measurement */}
            {activeTab === 'measurement' && (
              <div className="principle-card">
                <div className="principle-animation measurement-anim">
                  <div className="measurement-demo">
                    <div className="measure-before">
                      <div className="measure-particle split">
                        <span>X</span>
                        <span>X</span>
                      </div>
                    </div>
                    <div className="measure-arrow">
                      <Eye size={28} className="measure-eye" />
                      <ArrowRight size={24} />
                    </div>
                    <div className="measure-after">
                      <div className="measure-particle collapsed">
                        <span>X</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="principle-description">
                  {t('quantumComputing.principles.measurement.description')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quantum Hardware */}
      <section className="qc-section qc-hardware">
        <div className="qc-container">
          <h2 className="qc-section-title">{t('quantumComputing.hardware.title')}</h2>
          <div className="hardware-grid">
            {/* IBM */}
            <div className="hardware-card">
              <div className="hardware-image-placeholder">
                <span>IBM Quantum</span>
              </div>
              <h3>IBM Quantum</h3>
              <p>{t('quantumComputing.hardware.ibm')}</p>
            </div>

            {/* Microsoft */}
            <div className="hardware-card">
              <div className="hardware-image-placeholder microsoft">
                <span>Microsoft Majorana</span>
              </div>
              <h3>Microsoft Majorana 1</h3>
              <p>{t('quantumComputing.hardware.microsoft')}</p>
            </div>

            {/* Google */}
            <div className="hardware-card">
              <div className="hardware-image-placeholder google">
                <span>Google Sycamore</span>
              </div>
              <h3>Google Sycamore</h3>
              <p>{t('quantumComputing.hardware.google')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="qc-section qc-applications">
        <div className="qc-container">
          <h2 className="qc-section-title">{t('quantumComputing.applications.title')}</h2>
          <div className="applications-grid">
            <div className="app-card">
              <div className="app-icon">
                <Pill size={40} />
              </div>
              <h3>{t('quantumComputing.applications.medicine.title')}</h3>
              <p>{t('quantumComputing.applications.medicine.description')}</p>
            </div>
            <div className="app-card">
              <div className="app-icon">
                <Lock size={40} />
              </div>
              <h3>{t('quantumComputing.applications.security.title')}</h3>
              <p>{t('quantumComputing.applications.security.description')}</p>
            </div>
            <div className="app-card">
              <div className="app-icon">
                <Bot size={40} />
              </div>
              <h3>{t('quantumComputing.applications.ai.title')}</h3>
              <p>{t('quantumComputing.applications.ai.description')}</p>
            </div>
            <div className="app-card">
              <div className="app-icon">
                <Globe size={40} />
              </div>
              <h3>{t('quantumComputing.applications.climate.title')}</h3>
              <p>{t('quantumComputing.applications.climate.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Try the Game */}
      <section className="qc-section qc-cta">
        <div className="qc-container">
          <div className="cta-content">
            <h2>{t('quantumComputing.cta.title')}</h2>
            <p>{t('quantumComputing.cta.description')}</p>
            <button 
              className="cta-button"
              onClick={() => navigate('/game')}
            >
              <Gamepad2 size={24} />
              {t('quantumComputing.cta.button')}
              <ArrowRight size={20} className="cta-arrow" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default QuantumComputing;