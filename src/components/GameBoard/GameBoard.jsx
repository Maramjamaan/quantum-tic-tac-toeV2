import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES, PLAYERS, GAME_STATUS } from '../types/gameTypes';
import './QuantumTicTacToe.css';

// GameBoard Component (integrated)
const GameBoard = ({ 
  board, 
  gameState, 
  selectedSquares, 
  selectSquare, 
  currentPlayer, 
  isPlaying, 
  winningLine 
}) => {
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
        {square.quantumMoveIds.length > 1 && <div className="entanglement-indicator">⚡</div>}
      </div>
    );
  };

  return (
    <div className="game-board-container">
      <div className="game-status">
        {isPlaying && (
          <div className="current-player">
            Player {currentPlayer}'s turn
            {selectedSquares.length > 0 && (
              <span className="selection-count">
                {' '}({selectedSquares.length}/2 squares selected)
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

// ControlPanel Component (integrated)
const ControlPanel = ({ 
  gameState, 
  stats, 
  isPlaying, 
  isWaitingCollapse, 
  isGameOver, 
  winner, 
  resetGame, 
  autoPlay, 
  chooseCollapse, 
  autoCollapse 
}) => {
  const [showStats, setShowStats] = useState(false);

  const renderGameStatus = () => {
    if (isGameOver) {
      return (
        <div className="status-card game-over">
          <h3>🎉 Game Over!</h3>
          <p>{winner ? `Player ${winner} Wins!` : "It's a Draw!"}</p>
        </div>
      );
    }

    if (isWaitingCollapse) {
      const choosingPlayer = gameState.pendingCycle?.getCollapsePlayer();
      return (
        <div className="status-card collapse-pending">
          <h3>🌀 Quantum Collapse!</h3>
          <p>Player {choosingPlayer} must choose how to collapse the cycle</p>
        </div>
      );
    }

    return (
      <div className="status-card playing">
        <h3>🎮 Game in Progress</h3>
        <p>Current Player: <strong>{gameState.currentPlayer}</strong></p>
        <p>Move #{gameState.moveCount + 1}</p>
      </div>
    );
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h2>🎮 Control Panel</h2>
      </div>

      <section className="status-section">
        {renderGameStatus()}
      </section>

      <section className="controls-section">
        <h4>🎛️ Game Controls</h4>
        <div className="controls-grid">
          <button className="control-btn reset-btn" onClick={resetGame}>
            🔄 Reset Game
          </button>
          <button 
            className="control-btn auto-btn" 
            onClick={autoPlay}
            disabled={isGameOver}
          >
            🤖 Auto Play
          </button>
          <button 
            className="control-btn toggle-btn"
            onClick={() => setShowStats(!showStats)}
          >
            📊 {showStats ? 'Hide' : 'Show'} Stats
          </button>
        </div>
      </section>

      {showStats && (
        <section className="stats-section">
          <h4>📊 Game Statistics</h4>
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

      <section className="help-section">
        <details>
          <summary>❓ How to Play</summary>
          <div className="help-content">
            <ol>
              <li><strong>Quantum Moves:</strong> Select 2 squares for each move</li>
              <li><strong>Entanglement:</strong> Sharing squares creates quantum entanglement</li>
              <li><strong>Cycles:</strong> When entanglements form loops, collapse occurs</li>
              <li><strong>Winning:</strong> Get 3 classical marks in a row to win</li>
            </ol>
          </div>
        </details>
      </section>
    </div>
  );
};

// Main QuantumTicTacToe Component
const QuantumTicTacToe = () => {
  const gameHook = useGameState();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="quantum-tictactoe">
      <header className="game-header">
        <h1>⚛️ Quantum Tic-Tac-Toe</h1>
        <p className="game-subtitle">Where superposition meets strategy</p>
        <button 
          className="instructions-btn"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? 'Hide' : 'Show'} Instructions
        </button>
      </header>

      {showInstructions && (
        <section className="instructions">
          <div className="instructions-content">
            <h3>🎓 How Quantum Tic-Tac-Toe Works</h3>
            <div className="instruction-columns">
              <div className="instruction-column">
                <h4>🌀 Quantum Concepts</h4>
                <ul>
                  <li><strong>Superposition:</strong> Each move exists in 2 squares simultaneously</li>
                  <li><strong>Entanglement:</strong> Moves sharing squares become correlated</li>
                  <li><strong>Measurement:</strong> Forces quantum moves to collapse to classical</li>
                </ul>
              </div>
              <div className="instruction-column">
                <h4>🎮 Game Rules</h4>
                <ul>
                  <li>Select exactly 2 squares for each quantum move</li>
                  <li>When entanglements form cycles, choose how to collapse</li>
                  <li>Only classical marks count toward winning</li>
                  <li>First to get 3 classical marks in a row wins!</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="game-main">
        <div className="game-layout">
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

      <footer className="game-footer">
        <p>Based on Allan Goff's Quantum Tic-Tac-Toe paper</p>
        <p>🔬 A fun way to explore quantum mechanics concepts!</p>
      </footer>
    </div>
  );
};

export default QuantumTicTacToe;