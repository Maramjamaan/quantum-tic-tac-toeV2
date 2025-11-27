import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './CollapseOptions.css';

const CollapseOptions = ({ gameState, apiGameState, chooseCollapse }) => {
  const { t } = useLanguage();
  
  const options = gameState.collapseOptions || apiGameState?.collapseOptions || [];

  if (options.length === 0) {
    return (
      <div className="collapse-options-container">
        <div className="collapse-waiting">
          <div className="loading-spinner"></div>
          <p>{t('guide.collapse.generating')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collapse-options-container">
      <div className="collapse-options-header">
        <h3>{t('guide.collapse.optionsTitle')}</h3>
        <p className="collapse-options-desc">{t('guide.collapse.optionsDesc')}</p>
      </div>
      
      <div className="collapse-options-grid">
        {options.map((option, index) => (
          <div key={index} className="collapse-option-card">
            <div className="option-header">
              <span className="option-number">{t('guide.collapse.option', { number: index + 1 })}</span>
            </div>
            
            <div className="option-assignments">
              {Object.entries(option).map(([moveId, square]) => (
                <div key={moveId} className="assignment">
                  <span className="move-badge">{moveId}</span>
                  <span className="arrow">→</span>
                  <span className="square-badge">{t('guide.collapse.square', { number: square + 1 })}</span>
                </div>
              ))}
            </div>
            
            <button 
              className="choose-option-btn" 
              onClick={() => chooseCollapse(option)}
            >
              ✓ {t('guide.collapse.chooseThis')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollapseOptions;