import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './GuidePanel.css';

const GuidePanel = ({
  gameState,
  apiGameState,
  isPlaying,
  isWaitingCollapse,
  isGameOver,
  winner,
  selectedSquares = []
}) => {
  const { t } = useLanguage();

  // 🔍 DEBUG: Log what we receive
  console.log('=== GuidePanel Debug ===');
  console.log('isGameOver:', isGameOver);
  console.log('winner:', winner);
  console.log('apiGameState:', apiGameState);
  console.log('is_simultaneous:', apiGameState?.is_simultaneous);
  console.log('x_score:', apiGameState?.x_score);
  console.log('o_score:', apiGameState?.o_score);
  console.log('========================');

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
          // ✅ Check for simultaneous win from apiGameState
          const isSimultaneous = apiGameState?.is_simultaneous === true;
          const xScore = apiGameState?.x_score || 0;
          const oScore = apiGameState?.o_score || 0;
          
          console.log('🎯 Rendering gameOver - isSimultaneous:', isSimultaneous);
          
          // ✅ SIMULTANEOUS WIN - Special Design
          if (isSimultaneous) {
            const loser = winner === 'X' ? 'O' : 'X';
            
            console.log('🎉 Rendering SIMULTANEOUS WIN card!');
            
            return (
              <div className="guide-card simultaneous-win">
                {/* Header */}
                <div className="sim-header">
                  <h3 className="sim-title">{t('guide.victory.simultaneous')}</h3>
                </div>
                
                {/* Description */}
                <p className="sim-description">
                  {t('guide.victory.simultaneousDesc')}
                </p>
                
                {/* Score Cards */}
                <div className="sim-scores-container">
                  {/* Winner Card */}
                  <div className="sim-score-card winner-card">
                    <span className="sim-medal">🥇</span>
                    <span className="sim-player-name">{winner}</span>
                    <span className="sim-points">1 {t('guide.victory.point')}</span>
                  </div>
                  
                  {/* Runner-up Card */}
                  <div className="sim-score-card runnerup-card">
                    <span className="sim-medal">🥈</span>
                    <span className="sim-player-name">{loser}</span>
                    <span className="sim-points">½ {t('guide.victory.point')}</span>
                  </div>
                </div>
                
                {/* Explanation */}
                <p className="sim-reason">
                  {t('guide.victory.earliestMove', { player: winner })}
                </p>
              </div>
            );
          }
          
          // NORMAL WIN - Regular Design
          console.log('📋 Rendering NORMAL WIN card');
          return (
            <div className="guide-card victory">
              <h3 className="guide-title">{t('guide.victory.title')}</h3>
              <p className="guide-winner">
                {t('guide.victory.player', { player: winner })}
              </p>
              <p className="guide-explanation">
                {t('guide.victory.explanation')}
              </p>
            </div>
          );
        } else {
          // DRAW
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
                <strong>{t('guide.collapse.why')}</strong>
                {t('guide.collapse.whyDesc')}
              </p>
            </div>

            {/* Arrow pointing down to collapse options */}
            <div className="collapse-arrow-hint">
              <span className="arrow-down">↓</span>
              <span className="hint-text">{t('guide.collapse.optionsBelow') || 'Choose from options below'}</span>
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
                <strong>{t('guide.tip')}</strong>
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
                <strong>{t('guide.firstSquare.why')}</strong>
                {t('guide.firstSquare.whyDesc', { moveId })}
              </p>
            </div>

            <div className="guide-next">
              <p>
                <strong>{t('guide.next')}</strong>
                {t('guide.firstSquare.next')}
              </p>
            </div>
          </div>
        );
    }
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
    </div>
  );
};

export default GuidePanel;