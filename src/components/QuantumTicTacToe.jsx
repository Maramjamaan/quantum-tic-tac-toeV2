import React, { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES } from '../types/gameTypes';
import './QuantumTicTacToe.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import GuidePanel from './GuidePanel/GuidePanel';
import Logger from '../utils/logger';


// ✅ Square Component - Optimized with React.memo
const Square = memo(({ 
  index, 
  square, 
  isSelected, 
  isWinning, 
  isPlaying, 
  onSquareClick 
}) => {
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
  // ✅ Custom comparison - only re-render if these changed
  return (
    prevProps.square === nextProps.square &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isWinning === nextProps.isWinning &&
    prevProps.isPlaying === nextProps.isPlaying
  );
});

Square.displayName = 'Square';

// ✅ GameBoard Component - Now uses optimized Square
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
          {Array(9).fill().map((_, index) => (
            <Square
              key={index}
              index={index}
              square={board[index]}
              isSelected={selectedSquares.includes(index)}
              isWinning={winningLine.includes(index)}
              isPlaying={isPlaying}
              onSquareClick={selectSquare}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ✅ Main QuantumTicTacToe Component
const QuantumTicTacToe = () => {
  const gameHook = useGameState();
  const { t } = useLanguage();

  // Error message mapper
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
      {/* Navbar with language switcher */}
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
        <div className="game-layout">
          {/* Game Board */}
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

          {/* Guide Panel - Educational Interface */}
          <div className="control-section">
            <GuidePanel
              gameState={gameHook.gameState}
              apiGameState={gameHook.apiGameState}
              stats={gameHook.stats}
              isPlaying={gameHook.isPlaying}
              isWaitingCollapse={gameHook.isWaitingCollapse}
              isGameOver={gameHook.isGameOver}
              winner={gameHook.winner}
              resetGame={gameHook.resetGame}
              chooseCollapse={gameHook.chooseCollapse}
              selectedSquares={gameHook.selectedSquares}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QuantumTicTacToe;