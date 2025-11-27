import React, { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES } from '../types/gameTypes';
import './QuantumTicTacToe.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import GuidePanel from './GuidePanel/GuidePanel';
import ControlPanel from './ControlPanel/ControlPanel';
import Logger from '../utils/logger';


// ✅ Square Component - UPDATED with dual winning lines
const Square = memo(({ 
  index, 
  square, 
  isSelected, 
  isWinning,
  isXWinning,    // ✅ NEW: Is this square in X's winning line?
  isOWinning,    // ✅ NEW: Is this square in O's winning line?
  isPlaying, 
  onSquareClick 
}) => {
  const getSquareClass = () => {
    let classes = ['square'];
    if (isSelected) classes.push('selected');
    
    // ✅ UPDATED: Different classes for X and O winning lines
    if (isXWinning && isOWinning) {
      // Square is in BOTH winning lines (rare but possible)
      classes.push('winning', 'winning-both');
    } else if (isXWinning) {
      classes.push('winning', 'winning-x');
    } else if (isOWinning) {
      classes.push('winning', 'winning-o');
    } else if (isWinning) {
      classes.push('winning');
    }
    
    if (square.state === SQUARE_STATES.CLASSICAL) classes.push('classical');
    if (square.state === SQUARE_STATES.QUANTUM) classes.push('quantum');
    if (square.state === SQUARE_STATES.EMPTY) classes.push('empty');
    return classes.join(' ');
  };

  const handleClick = () => {
    if (!isPlaying) return;

    if (square.state === SQUARE_STATES.CLASSICAL) {
      Logger.debug('Cannot select classical square');
      return;
    }

    onSquareClick(index);
  };

  return (
    <div
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
}, (prevProps, nextProps) => {
  return (
    prevProps.square === nextProps.square &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isWinning === nextProps.isWinning &&
    prevProps.isXWinning === nextProps.isXWinning &&  // ✅ NEW
    prevProps.isOWinning === nextProps.isOWinning &&  // ✅ NEW
    prevProps.isPlaying === nextProps.isPlaying
  );
});

Square.displayName = 'Square';

// ✅ Compact Collapse Options Component (inline)
const CollapseOptionsCompact = ({ gameState, apiGameState, chooseCollapse, t }) => {
  const options = gameState.collapseOptions || apiGameState?.collapseOptions || [];

  if (options.length === 0) {
    return (
      <div className="collapse-compact">
        <div className="collapse-loading">
          <span className="spinner-small"></span>
          <span>{t('guide.collapse.generating')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="collapse-compact">
      <div className="collapse-compact-header">
        <span className="collapse-icon">🌀</span>
        <span>{t('guide.collapse.optionsTitle')}</span>
      </div>
      
      <div className="collapse-compact-options">
        {options.map((option, index) => (
          <button 
            key={index}
            className="collapse-compact-btn"
            onClick={() => chooseCollapse(option)}
            title={Object.entries(option).map(([m, s]) => `${m}→${s+1}`).join(', ')}
          >
            <span className="option-label">{t('guide.collapse.option', { number: index + 1 })}</span>
            <span className="option-preview">
              {Object.entries(option).map(([moveId, square]) => (
                <span key={moveId} className="mini-assignment">
                  {moveId}→{square + 1}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ✅ GameBoard Component - UPDATED with dual winning lines
const GameBoard = ({
  board,
  selectedSquares,
  selectSquare,
  currentPlayer,
  isPlaying,
  winningLine,
  xWinningLine = [],  // ✅ NEW: X's winning line
  oWinningLine = [],  // ✅ NEW: O's winning line
  // Collapse props
  isWaitingCollapse,
  gameState,
  apiGameState,
  chooseCollapse
}) => {
  const { t } = useLanguage();

  return (
    <div className="game-board-wrapper">
      <div className="game-board-container">
        <div className="game-status">
          {isPlaying && !isWaitingCollapse && (
            <div className="current-player">
              {t('gameBoard.playerTurn', { player: currentPlayer })}
              {selectedSquares.length > 0 && (
                <span className="selection-count">
                  {' '}{t('gameBoard.squaresSelected', { count: selectedSquares.length })}
                </span>
              )}
            </div>
          )}
          {isWaitingCollapse && (
            <div className="collapse-status">
               {t('guide.collapse.title')}
            </div>
          )}
        </div>

        <div className="game-board">
          <div className="board-grid">
            {Array(9).fill().map((_, index) => (
              <Square
                key={index}
                index={index}
                square={board[index]}
                isSelected={selectedSquares.includes(index)}
                isWinning={winningLine.includes(index)}
                isXWinning={xWinningLine.includes(index)}  // ✅ NEW
                isOWinning={oWinningLine.includes(index)}  // ✅ NEW
                isPlaying={isPlaying && !isWaitingCollapse}
                onSquareClick={selectSquare}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Collapse Options - Compact, below board */}
      {isWaitingCollapse && (
        <CollapseOptionsCompact 
          gameState={gameState}
          apiGameState={apiGameState}
          chooseCollapse={chooseCollapse}
          t={t}
        />
      )}
    </div>
  );
};

// Main QuantumTicTacToe Component
const QuantumTicTacToe = () => {
  const gameHook = useGameState();
  const { t } = useLanguage();

  const getErrorMessage = (errorCode) => {
    const errorMap = {
      'ERROR_SERVER_DOWN': t('errors.serverDown'),
      'ERROR_MOVE_FAILURE': t('errors.moveFailure'),
      'ERROR_COLLAPSE_FAILURE': t('errors.collapseFailure'),
      'ERROR_RESET_FAILURE': t('errors.resetFailure'),
      'ERROR_NO_SQUARES': t('errors.noSquaresAvailable')
    };
    return errorMap[errorCode] || errorCode;
  };

  return (
    <div className="quantum-tictactoe">
      <Navbar />

      {/* Error Message Banner */}
      {gameHook.userError && (
        <div className="error-banner">
          <div className="error-banner-content">
            <span className="error-icon">⚠️</span>
            <span className="error-banner-text">
              {getErrorMessage(gameHook.userError)}
            </span>
          </div>
          <button
            className="error-close-btn"
            onClick={() => gameHook.clearError && gameHook.clearError()}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main game area */}
      <main className="game-main">
        
        {/* 3-Column Layout: Guide | Board + Collapse | Controls */}
        <div className="game-layout-three-columns">
          
          {/* LEFT: Smart Guide Panel */}
          <div className="guide-section">
            <GuidePanel
              gameState={gameHook.gameState}
              apiGameState={gameHook.apiGameState}
              isPlaying={gameHook.isPlaying}
              isWaitingCollapse={gameHook.isWaitingCollapse}
              isGameOver={gameHook.isGameOver}
              winner={gameHook.winner}
              selectedSquares={gameHook.selectedSquares}
            />
          </div>

          {/* CENTER: Game Board + Collapse Options */}
          <div className="board-section">
            <GameBoard
              board={gameHook.board}
              selectedSquares={gameHook.selectedSquares}
              selectSquare={gameHook.selectSquare}
              currentPlayer={gameHook.currentPlayer}
              isPlaying={gameHook.isPlaying}
              winningLine={gameHook.winningLine}
              xWinningLine={gameHook.xWinningLine}  // ✅ NEW
              oWinningLine={gameHook.oWinningLine}  // ✅ NEW
              isWaitingCollapse={gameHook.isWaitingCollapse}
              gameState={gameHook.gameState}
              apiGameState={gameHook.apiGameState}
              chooseCollapse={gameHook.chooseCollapse}
            />
          </div>

          {/* RIGHT: Control Panel */}
          <div className="control-section">
            <ControlPanel
              stats={gameHook.stats}
              resetGame={gameHook.resetGame}
            />
          </div>

        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default QuantumTicTacToe;