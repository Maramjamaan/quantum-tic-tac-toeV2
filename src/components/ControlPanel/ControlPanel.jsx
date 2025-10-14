import React, { useState } from 'react';

// Mock constants for demonstration
const GAME_STATUS = {
  PLAYING: 'playing',
  WAITING_COLLAPSE: 'waiting_collapse',
  X_WINS: 'x_wins',
  O_WINS: 'o_wins',
  DRAW: 'draw'
};

const PLAYERS = {
  X: 'X',
  O: 'O'
};

// Mock useGameState hook with demo data
const useGameState = () => {
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [showingCollapse, setShowingCollapse] = useState(false);

  // Mock game data
  const gameState = {
    status: gameStatus,
    currentPlayer,
    moveCount: 5,
    pendingCycle: showingCollapse ? {
      id: 'cycle_123',
      moveIds: ['X1', 'O2', 'X3'],
      getCollapsePlayer: () => PLAYERS.O
    } : null,
    collapseOptions: showingCollapse ? [
      { id: 'opt1', assignments: new Map([['X1', 1], ['O2', 4], ['X3', 7]]), score: 85 },
      { id: 'opt2', assignments: new Map([['X1', 0], ['O2', 3], ['X3', 8]]), score: 60 }
    ] : []
  };

  const stats = {
    totalMoves: 5,
    quantumMoves: 3,
    classicalMoves: 2,
    entanglements: 2,
    emptySquares: 4,
    quantumSquares: 3,
    classicalSquares: 2
  };

  const debugInfo = {
    entanglements: 2,
    pendingCycle: showingCollapse,
    collapseOptions: showingCollapse ? 2 : 0,
    lastAction: 'quantum_move'
  };

  return {
    gameState,
    stats,
    debugInfo,
    isPlaying: gameStatus === GAME_STATUS.PLAYING,
    isWaitingCollapse: gameStatus === GAME_STATUS.WAITING_COLLAPSE || showingCollapse,
    isGameOver: [GAME_STATUS.X_WINS, GAME_STATUS.O_WINS, GAME_STATUS.DRAW].includes(gameStatus),
    winner: gameStatus === GAME_STATUS.X_WINS ? PLAYERS.X : gameStatus === GAME_STATUS.O_WINS ? PLAYERS.O : null,
    resetGame: () => {
      setGameStatus(GAME_STATUS.PLAYING);
      setCurrentPlayer(PLAYERS.X);
      setShowingCollapse(false);
    },
    autoPlay: () => {
      setCurrentPlayer(currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X);
    },
    chooseCollapse: (option) => {
      console.log('Chosen collapse option:', option.id);
      setShowingCollapse(false);
      setGameStatus(GAME_STATUS.PLAYING);
    },
    autoCollapse: () => {
      console.log('Auto collapse applied');
      setShowingCollapse(false);
      setGameStatus(GAME_STATUS.PLAYING);
    },
    // Demo functions
    simulateCollapse: () => setShowingCollapse(true),
    simulateWin: () => setGameStatus(GAME_STATUS.X_WINS),
    simulateDraw: () => setGameStatus(GAME_STATUS.DRAW)
  };
};

const ControlPanel = () => {
  const {
    gameState,
    stats,
    debugInfo,
    isPlaying,
    isWaitingCollapse,
    isGameOver,
    winner,
    resetGame,
    autoPlay,
    chooseCollapse,
    autoCollapse,
    simulateCollapse,
    simulateWin,
    simulateDraw
  } = useGameState();

  const [showStats, setShowStats] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Render game status
  const renderGameStatus = () => {
    if (isGameOver) {
      return (
        <div className="status-card game-over">
          <h3>🎉 Game Over!</h3>
          <p>
            {winner ? `Player ${winner} Wins!` : 'It\'s a Draw!'}
          </p>
        </div>
      );
    }

    if (isWaitingCollapse) {
      const choosingPlayer = gameState.pendingCycle?.getCollapsePlayer();
      return (
        <div className="status-card collapse-pending">
          <h3>🌀 Quantum Collapse!</h3>
          <p>Player {choosingPlayer} must choose how to collapse the cycle</p>
          <p className="cycle-info">
            Cycle involves: {gameState.pendingCycle?.moveIds.join(', ')}
          </p>
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

  // Render collapse options
  const renderCollapseOptions = () => {
    if (!isWaitingCollapse || !gameState.collapseOptions.length) return null;

    return (
      <div className="collapse-section">
        <h4>Choose Collapse Option:</h4>
        <div className="collapse-options">
          {gameState.collapseOptions.map((option, index) => (
            <div key={option.id} className="collapse-option">
              <div className="option-header">
                <h5>Option {index + 1}</h5>
                <span className="option-score">Score: {option.score}</span>
              </div>
              <div className="option-assignments">
                {Array.from(option.assignments.entries()).map(([moveId, square]) => (
                  <div key={moveId} className="assignment">
                    {moveId} → Square {square + 1}
                  </div>
                ))}
              </div>
              <button 
                className="choose-btn"
                onClick={() => chooseCollapse(option)}
              >
                Choose This Option
              </button>
            </div>
          ))}
        </div>
        <div className="auto-collapse-section">
          <button 
            className="auto-btn"
            onClick={autoCollapse}
          >
            🤖 Auto-Choose Best Option
          </button>
        </div>
      </div>
    );
  };

  // Render game statistics
  const renderStats = () => {
    if (!showStats) return null;

    return (
      <div className="stats-section">
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
          <div className="stat-item">
            <span className="stat-label">Empty Squares:</span>
            <span className="stat-value">{stats.emptySquares}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quantum Squares:</span>
            <span className="stat-value">{stats.quantumSquares}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render debug info
  const renderDebugInfo = () => {
    if (!showDebug) return null;

    return (
      <div className="debug-section">
        <h4>🔧 Debug Info</h4>
        <div className="debug-grid">
          <div>Entanglements: {debugInfo.entanglements}</div>
          <div>Pending Cycle: {debugInfo.pendingCycle ? 'Yes' : 'No'}</div>
          <div>Collapse Options: {debugInfo.collapseOptions}</div>
          <div>Last Action: {debugInfo.lastAction}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="control-panel">
      <div className="panel-header">
        <h2>🎮 Quantum Tic-Tac-Toe Control Panel</h2>
      </div>

      {/* Game Status */}
      <section className="status-section">
        {renderGameStatus()}
      </section>

      {/* Collapse Options */}
      {isWaitingCollapse && (
        <section className="collapse-section-wrapper">
          {renderCollapseOptions()}
        </section>
      )}

      {/* Main Controls */}
      <section className="controls-section">
        <h4>🎛️ Game Controls</h4>
        <div className="controls-grid">
          <button 
            className="control-btn reset-btn"
            onClick={resetGame}
          >
            🔄 Reset Game
          </button>
          
          <button 
            className="control-btn auto-btn"
            onClick={autoPlay}
            disabled={isGameOver || isWaitingCollapse}
          >
            🤖 Auto Play
          </button>
          
          <button 
            className="control-btn toggle-btn"
            onClick={() => setShowStats(!showStats)}
          >
            📊 {showStats ? 'Hide' : 'Show'} Stats
          </button>
          
          <button 
            className="control-btn toggle-btn"
            onClick={() => setShowDebug(!showDebug)}
          >
            🔧 {showDebug ? 'Hide' : 'Show'} Debug
          </button>
        </div>
      </section>

      {/* Demo Controls */}
      <section className="demo-section">
        <h4>🎭 Demo Controls</h4>
        <div className="demo-grid">
          <button 
            className="demo-btn"
            onClick={simulateCollapse}
            disabled={isWaitingCollapse}
          >
            🌀 Simulate Collapse
          </button>
          
          <button 
            className="demo-btn"
            onClick={simulateWin}
            disabled={isGameOver}
          >
            🏆 Simulate Win
          </button>
          
          <button 
            className="demo-btn"
            onClick={simulateDraw}
            disabled={isGameOver}
          >
            🤝 Simulate Draw
          </button>
        </div>
      </section>

      {/* Statistics */}
      {renderStats()}

      {/* Debug Info */}
      {renderDebugInfo()}

      {/* Help Section */}
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

export default ControlPanel;