import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES, PLAYERS, GAME_STATUS } from '../types/gameTypes';
import './QuantumTicTacToe.css';

// Instructions Panel Component (Left Side)
const InstructionsPanel = ({ stats }) => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState('');
  return (
    <div className="instructions-panel">
      <h2>{t('instructions.title')}</h2>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'quantum' ? '' : 'quantum')}
        >
          <span>{t('instructions.quantum.title')}</span>
          <span className="arrow">{expandedSection === 'quantum' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'quantum' && (
          <div className="section-content">
            <div className="concept-item">
              {t('instructions.quantum.superposition')}
            </div>
            <div className="concept-item">
              {t('instructions.quantum.entanglement')}
            </div>
            <div className="concept-item">
              {t('instructions.quantum.collapse')}
            </div>
            <div className="concept-item">
              {t('instructions.quantum.cycles')}
            </div>
          </div>
        )}
      </div>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'rules' ? '' : 'rules')}
        >
          <span>{t('instructions.rules.title')}</span>
          <span className="arrow">{expandedSection === 'rules' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'rules' && (
          <div className="section-content">
            <ol className="rules-list">
              <li>{t('instructions.rules.rule1')}</li>
              <li>{t('instructions.rules.rule2')}</li>
              <li>{t('instructions.rules.rule3')}</li>
              <li>{t('instructions.rules.rule4')}</li>
              <li>{t('instructions.rules.rule5')}</li>
            </ol>
          </div>
        )}
      </div>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'strategy' ? '' : 'strategy')}
        >
          <span>{t('instructions.strategy.title')}</span>
          <span className="arrow">{expandedSection === 'strategy' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'strategy' && (
          <div className="section-content">
            <ul className="tips-list">
              <li>{t('instructions.strategy.tip1')}</li>
              <li>{t('instructions.strategy.tip2')}</li>
              <li>{t('instructions.strategy.tip3')}</li>
              <li>{t('instructions.strategy.tip4')}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="quick-stats">
        <h3>{t('stats.quickStats')}</h3>

        <div className="stat-row">
          <span>{t('stats.quantumMoves')}</span>
          <span className="stat-value">{stats.quantumMoves}</span>
        </div>

        <div className="stat-row">
          <span>{t('stats.entanglements')}</span>
          <span className="stat-value">{stats.entanglements}</span>
        </div>

        <div className="stat-row">
          <span>{t('stats.collapses')}</span>
          <span className="stat-value">0</span>
        </div>
      </div>
    </div>
  );
};

// GameBoard Component
const GameBoard = ({
  board,
  gameState,
  selectedSquares,
  selectSquare,
  currentPlayer,
  isPlaying,
  winningLine
}) => {
  const { t } = useLanguage(); 
  const renderSquare = (index) => {
    const square = board[index];
    const isSelected = selectedSquares.includes(index);
    const isWinning = winningLine.includes(index);

    const getSquareClass = () => {
      let classes = ['square'];
      if (isSelected) classes.push('selected');
      if (isWinning) classes.push('winning');
      if (square.state === SQUARE_STATES.CLASSICAL) classes.push('classical');
      if (square.state === SQUARE_STATES.QUANTUM) classes.push('quantum');
      if (square.state === SQUARE_STATES.EMPTY) classes.push('empty');
      return classes.join(' ');
    };

    const handleClick = () => {
      if (!isPlaying) return;

      // Don't allow selection of classical squares
      if (square.state === SQUARE_STATES.CLASSICAL) {
        console.log('Cannot select classical square');
        return;
      }

      selectSquare(index);
    };

    return (
      <div
        key={index}
        className={getSquareClass()}
        onClick={handleClick}
        data-square={index}
      >
        <div className="square-number">{index + 1}</div>

        {square.state === SQUARE_STATES.CLASSICAL && (
          <div className="classical-mark">
            <span className="player-mark">
              {square.classicalMoveId?.charAt(0) || 'X'}
            </span>
          </div>
        )}

        {square.state === SQUARE_STATES.QUANTUM && (
          <div className="quantum-marks">
            {square.quantumMoveIds.map(moveId => (
              <div key={moveId} className={`quantum-mark player-${moveId.charAt(0).toLowerCase()}`}>
                {moveId}
              </div>
            ))}
          </div>
        )}

        {isSelected && <div className="selection-indicator" />}
        {square.quantumMoveIds && square.quantumMoveIds.length > 1 && (
          <div className="entanglement-indicator">⚡</div>
        )}
      </div>
    );
  };

  return (
    <div className="game-board-container">
      <div className="game-status">
        {isPlaying && (
          <div className="current-player">
            {t('gameBoard.playerTurn', { player: currentPlayer })}
            {selectedSquares.length > 0 && (
              <span className="selection-count">
                {' '}{t('gameBoard.squaresSelected', { count: selectedSquares.length })}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="game-board">
        <div className="board-grid">
          {Array(9).fill().map((_, index) => renderSquare(index))}
        </div>
      </div>
    </div>
  );
};

// ControlPanel Component
const ControlPanel = ({
  gameState,
  apiGameState,
  stats,
  isPlaying,
  isWaitingCollapse,
  isGameOver,
  winner,
  resetGame,
  chooseCollapse,

}) => {
  const { t } = useLanguage();
  const [showStats, setShowStats] = useState(false);

  const renderGameStatus = () => {
    if (isGameOver) {
      if (winner) {
        return (
          <div className="status-card game-over">
            <h3> {t('controlPanel.gameOver')}</h3>
            <p className="winner-text">{t('controlPanel.playerWins', { player: winner })}</p>
          </div>
        );
      } else {
        return (
          <div className="status-card game-over">
            <h3> {t('controlPanel.gameOver')}</h3>
            <p className="draw-text">{t('controlPanel.draw')}</p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              {t('controlPanel.drawReason')}
            </p>
          </div>
        );
      }
    }

    if (isWaitingCollapse) {
      const cycleCreator = gameState.cycleCreator;
      const choosingPlayer = gameState.collapseChooser || gameState.currentPlayer;

      return (
        <div className="status-card collapse-pending">
          <h3> {t('controlPanel.quantumCollapse')}</h3>
          <p>{t('controlPanel.cycleDetected')}</p>
          {cycleCreator && (
            <p>{t('controlPanel.createdCycle', { player: cycleCreator })}</p>
          )}
          <p>{t('controlPanel.chooseCollapse', { player: choosingPlayer })}</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            {t('controlPanel.chooserNote')}
          </p>
        </div>
      );
    }

    // Use the current player from API state for accuracy
    const currentPlayer = apiGameState?.current_player || gameState.currentPlayer;
    const moveNumber = (apiGameState?.move_count || 0) + 1;

    return (
      <div className="status-card playing">
        <h3> {t('controlPanel.gameInProgress')}</h3>
        <p>{t('controlPanel.currentPlayer')} <strong>{currentPlayer}</strong></p>
        <p>{t('controlPanel.moveNumber', { number: moveNumber })}</p>
      </div>
    );
  };

  const renderCollapseOptions = () => {
    // Check both sources for collapse options
    const options = gameState.collapseOptions || apiGameState?.collapseOptions || [];

    if (!isWaitingCollapse || options.length === 0) {
      return (
        <div className="no-options">
          <p style={{ textAlign: 'center', color: '#666', padding: '1rem' }}>
            {t('controlPanel.generating')}
          </p>
          <button
            className="control-btn reset-btn"
            onClick={resetGame}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Reset Game (If stuck)
          </button>
        </div>
      );
    }

    return (
      <div className="collapse-section">
        <h4>{t('controlPanel.collapseTitle')}</h4>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
          {t('controlPanel.collapseDescription')}
        </p>
        <div className="collapse-options">
          {options.map((option, index) => (
            <div key={index} className="collapse-option">
              <div className="option-header">
                <h5>{t('controlPanel.option', { number: index + 1 })}</h5>
              </div>
              <div className="option-assignments">
                {Object.entries(option).map(([moveId, square]) => (
                  <div key={moveId} className="assignment">
                    <strong>{moveId}</strong> → square <strong>{square + 1}</strong>
                  </div>
                ))}
              </div>
              <button className="choose-btn" onClick={() => chooseCollapse(option)}>
                ✓ {t('controlPanel.chooseThis')}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h2> {t('controlPanel.title')}</h2>
      </div>

      <section className="status-section">
        {renderGameStatus()}
      </section>

      {isWaitingCollapse && (
        <section className="collapse-section-wrapper">
          {renderCollapseOptions()}
        </section>
      )}

      <section className="controls-section">
        <h4>Game Controls</h4>
        <div className="controls-grid">
          <button className="control-btn reset-btn" onClick={resetGame}>
            🔄 {t('controlPanel.resetGame')}
          </button>

          <button
            className="control-btn toggle-btn"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? t('controlPanel.hideStats') : t('controlPanel.showStats')}
          </button>
        </div>
      </section>

      {showStats && (
        <section className="stats-section">
          <h4>Game Statistics</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Moves:</span>
              <span className="stat-value">{stats.totalMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Quantum Moves:</span>
              <span className="stat-value">{stats.quantumMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Classical Moves:</span>
              <span className="stat-value">{stats.classicalMoves}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Entanglements:</span>
              <span className="stat-value">{stats.entanglements}</span>
            </div>
          </div>
        </section>
      )}


    </div>
  );
};

// Main QuantumTicTacToe Component
const QuantumTicTacToe = () => {
  const { t } = useLanguage();  // ← هذا موجود
  const gameHook = useGameState();

  return (
    <div className="quantum-tictactoe">
      <LanguageSwitcher />

      <header className="game-header">
        <h1>{t('title')}</h1>
        <p className="game-subtitle">{t('subtitle')}</p>
      </header>


      <main className="game-main">
        <div className="game-layout">
          <InstructionsPanel stats={gameHook.stats} />

          <div className="board-section">
            <GameBoard
              board={gameHook.board}
              gameState={gameHook.gameState}
              selectedSquares={gameHook.selectedSquares}
              selectSquare={gameHook.selectSquare}
              currentPlayer={gameHook.currentPlayer}
              isPlaying={gameHook.isPlaying}
              winningLine={gameHook.winningLine}
            />
          </div>

          <div className="control-section">
            <ControlPanel
              gameState={gameHook.gameState}
              apiGameState={gameHook.apiGameState}
              stats={gameHook.stats}
              isPlaying={gameHook.isPlaying}
              isWaitingCollapse={gameHook.isWaitingCollapse}
              isGameOver={gameHook.isGameOver}
              winner={gameHook.winner}
              resetGame={gameHook.resetGame}
              autoPlay={gameHook.autoPlay}
              chooseCollapse={gameHook.chooseCollapse}
              autoCollapse={gameHook.autoCollapse}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuantumTicTacToe;