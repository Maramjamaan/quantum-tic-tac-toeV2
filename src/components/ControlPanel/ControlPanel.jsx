import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './ControlPanel.css';

const ControlPanel = ({ stats, resetGame }) => {
  const { t } = useLanguage();
  const [showStats, setShowStats] = useState(true);

  return (
    <div className="control-panel">
      {/* Header */}
      <div className="control-panel-header">
        <h2>{t('guide.controls.title')}</h2>
      </div>

      {/* Game Controls */}
      <section className="controls-section">
        <button className="control-btn reset-btn" onClick={resetGame}>
          {t('guide.controls.reset')}
        </button>

        <button
          className="control-btn stats-btn"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? t('guide.controls.hideStats') : t('guide.controls.showStats')}
        </button>
      </section>

      {/* Statistics */}
      {showStats && (
        <section className="stats-section">
          <h4>{t('guide.stats.title')}</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">{t('guide.stats.totalMoves')}</span>
              <span className="stat-value">{stats.totalMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('guide.stats.quantumMoves')}</span>
              <span className="stat-value">{stats.quantumMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('guide.stats.classicalMoves')}</span>
              <span className="stat-value">{stats.classicalMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">{t('guide.stats.entanglements')}</span>
              <span className="stat-value">{stats.entanglements}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ControlPanel;