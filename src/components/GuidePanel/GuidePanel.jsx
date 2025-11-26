import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './GuidePanel.css';

const GuidePanel = ({
  gameState,
  apiGameState,
  stats,
  isPlaying,
  isWaitingCollapse,
  isGameOver,
  winner,
  resetGame,
  chooseCollapse,
  selectedSquares = []
}) => {
  const { t } = useLanguage();
  const [showStats, setShowStats] = useState(false);

  // Determine current game phase
  const getCurrentPhase = () => {
    if (isGameOver) return 'gameOver';
    if (isWaitingCollapse) return 'collapse';
    if (selectedSquares.length === 1) return 'secondSquare';
    if (selectedSquares.length === 0) return 'firstSquare';
    return 'playing';
  };

  const phase = getCurrentPhase();
  const currentPlayer = apiGameState?.current_player || gameState.currentPlayer;
  const moveNumber = (apiGameState?.move_count || 0) + 1;

  // Smart Guide Content based on phase
  const renderSmartGuide = () => {
    switch (phase) {
    case 'gameOver':
  if (winner) {
    const isSimultaneous = apiGameState?.is_simultaneous;
    const xScore = apiGameState?.x_score || 0;
    const oScore = apiGameState?.o_score || 0;
    
    return (
      <div className="guide-card victory">
        <h3 className="guide-title">{t('guide.victory.title')}</h3>
        <p className="guide-winner">
          {t('guide.victory.player', { player: winner })}
        </p>
        
        {isSimultaneous && (
          <div className="simultaneous-scores">
            <p className="simultaneous-title">{t('guide.victory.simultaneous')}</p>
            <p className="simultaneous-desc">{t('guide.victory.simultaneousDesc')}</p>
            <div className="scores-display">
              <span className={`score-item ${xScore === 1 ? 'winner' : 'loser'}`}>
                {xScore === 1 
                  ? t('guide.victory.score', { player: 'X', score: '1' })
                  : t('guide.victory.scoreHalf', { player: 'X' })
                }
              </span>
              <span className={`score-item ${oScore === 1 ? 'winner' : 'loser'}`}>
                {oScore === 1 
                  ? t('guide.victory.score', { player: 'O', score: '1' })
                  : t('guide.victory.scoreHalf', { player: 'O' })
                }
              </span>
            </div>
          </div>
        )}
        
        <p className="guide-explanation">
          {t('guide.victory.explanation')}
        </p>
      </div>
    );
  } else {
    // Draw case
    return (
      <div className="guide-card draw">
        <h3 className="guide-title">{t('guide.draw.title')}</h3>
        <p className="guide-explanation">
          {t('guide.draw.explanation')}
        </p>
      </div>
    );
  }
      case 'collapse':
        const cycleCreator = gameState.cycleCreator;
        const choosingPlayer = gameState.collapseChooser || currentPlayer;
        
        return (
          <div className="guide-card collapse-phase">
            
            <h3 className="guide-title">{t('guide.collapse.title')}</h3>
            
            <div className="guide-context">
              <p className="guide-what">
                <strong>{t('guide.collapse.what')}</strong>
                {t('guide.collapse.whatDesc')}
              </p>
            </div>

            {cycleCreator && (
              <p className="guide-who">
                {t('guide.collapse.creator', { player: cycleCreator })}
              </p>
            )}

            <div className="guide-action">
              <p className="guide-action-text">
                <strong>{t('guide.collapse.action')}</strong>
                {t('guide.collapse.actionDesc', { player: choosingPlayer })}
              </p>
            </div>

            <div className="guide-why">
              <p>
                <strong> {t('guide.collapse.why')}</strong>
                {t('guide.collapse.whyDesc')}
              </p>
            </div>
          </div>
        );

      case 'secondSquare':
        return (
          <div className="guide-card second-square">
           
            <h3 className="guide-title">
              {t('guide.secondSquare.title', { player: currentPlayer })}
            </h3>

            <div className="guide-progress">
              <div className="progress-dots">
                <span className="dot filled">●</span>
                <span className="dot current">●</span>
                <span className="progress-label">
                  {t('guide.progress.step', { current: 2, total: 2 })}
                </span>
              </div>
            </div>

            <div className="guide-action">
              <p className="guide-action-text">
                <strong>{t('guide.secondSquare.action')}</strong>
                {t('guide.secondSquare.actionDesc')}
              </p>
            </div>

            <div className="guide-why">
              <p>
                <strong>{t('guide.secondSquare.why')}</strong>
                {t('guide.secondSquare.whyDesc')}
              </p>
            </div>

            <div className="guide-tip">
              <p>
                <strong> {t('guide.tip')}</strong>
                {t('guide.secondSquare.tip')}
              </p>
            </div>
          </div>
        );

      case 'firstSquare':
      default:
        const moveId = `${currentPlayer}${moveNumber}`;
        
        return (
          <div className="guide-card first-square">
            
            <h3 className="guide-title">
              {t('guide.firstSquare.title', { player: currentPlayer })}
            </h3>

            <div className="guide-move-badge">
              <span className="move-label">{t('guide.moveBadge')}</span>
              <span className="move-id">{moveId}</span>
            </div>

            <div className="guide-action">
              <p className="guide-action-text">
                <strong>{t('guide.firstSquare.action')}</strong>
                {t('guide.firstSquare.actionDesc')}
              </p>
            </div>

            <div className="guide-why">
              <p>
                <strong> {t('guide.firstSquare.why')}</strong>
                {t('guide.firstSquare.whyDesc', { moveId })}
              </p>
            </div>

            <div className="guide-next">
              <p>
                <strong> {t('guide.next')}</strong>
                {t('guide.firstSquare.next')}
              </p>
            </div>
          </div>
        );
    }
  };

  // Render collapse options
  const renderCollapseOptions = () => {
    const options = gameState.collapseOptions || apiGameState?.collapseOptions || [];

    if (!isWaitingCollapse || options.length === 0) {
      return (
        <div className="collapse-waiting">
          <div className="loading-spinner"></div>
          <p>{t('guide.collapse.generating')}</p>
        </div>
      );
    }

    return (
      <div className="collapse-options-section">
        <h4 className="options-title">{t('guide.collapse.optionsTitle')}</h4>
        <p className="options-description">{t('guide.collapse.optionsDesc')}</p>
        
        <div className="collapse-options">
          {options.map((option, index) => (
            <div key={index} className="collapse-option">
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

  return (
    <div className="guide-panel">
      {/* Header */}
      <div className="guide-panel-header">
        <h2>{t('guide.title')}</h2>
      </div>

      {/* Smart Guide Card */}
      <section className="smart-guide-section">
        {renderSmartGuide()}
      </section>

      {/* Collapse Options (only when collapsing) */}
      {isWaitingCollapse && (
        <section className="collapse-section">
          {renderCollapseOptions()}
        </section>
      )}

      {/* Game Controls */}
      <section className="controls-section">
        <h4>{t('guide.controls.title')}</h4>
        <div className="controls-grid">
          <button className="control-btn reset-btn" onClick={resetGame}>
            {t('guide.controls.reset')}
          </button>

          <button
            className="control-btn stats-btn"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? t('guide.controls.hideStats') : t('guide.controls.showStats')}
          </button>
        </div>
      </section>

      {/* Statistics (collapsible) */}
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

export default GuidePanel;