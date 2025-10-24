import React, { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES, PLAYERS, GAME_STATUS } from '../types/gameTypes';
import './QuantumTicTacToe.css';

// Instructions Panel Component (Left Side)
const InstructionsPanel = ({ stats }) => {
  const [expandedSection, setExpandedSection] = useState('');

  return (
    <div className="instructions-panel">
      <h2>How to Play</h2>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'quantum' ? '' : 'quantum')}
        >
          <span>Quantum Concepts</span>
          <span className="arrow">{expandedSection === 'quantum' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'quantum' && (
          <div className="section-content">
            <div className="concept-item">
              <strong>Superposition:</strong> Each move exists in 2 squares simultaneously
            </div>
            <div className="concept-item">
              <strong>Entanglement:</strong> Moves sharing squares become correlated
            </div>
            <div className="concept-item">
              <strong>Collapse:</strong> Quantum states resolve to classical positions
            </div>
            <div className="concept-item">
              <strong>Cycles:</strong> Closed loops trigger measurement
            </div>
          </div>
        )}
      </div>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'rules' ? '' : 'rules')}
        >
          <span>Game Rules</span>
          <span className="arrow">{expandedSection === 'rules' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'rules' && (
          <div className="section-content">
            <ol className="rules-list">
              <li>Select exactly 2 squares per move</li>
              <li>Your mark exists in both squares</li>
              <li>Sharing squares creates entanglement</li>
              <li>Cycles force quantum collapse</li>
              <li>Get 3 classical marks in a row to win</li>
            </ol>
          </div>
        )}
      </div>

      <div className="instruction-section">
        <button
          className="section-header"
          onClick={() => setExpandedSection(expandedSection === 'strategy' ? '' : 'strategy')}
        >
          <span>Strategy Tips</span>
          <span className="arrow">{expandedSection === 'strategy' ? '▼' : '▶'}</span>
        </button>
        {expandedSection === 'strategy' && (
          <div className="section-content">
            <ul className="tips-list">
              <li>Create entanglements to control collapse</li>
              <li>Force cycles when you're ahead</li>
              <li>Block opponent's quantum moves</li>
              <li>Think probabilistically</li>
            </ul>
          </div>
        )}
      </div>

      <div className="quick-stats">
        <h3>Quick Stats</h3>
        <div className="stat-row">
          <span>Quantum Moves:</span>
          <span className="stat-value">{stats.quantumMoves}</span>
        </div>
        <div className="stat-row">
          <span>Entanglements:</span>
          <span className="stat-value">{stats.entanglements}</span>
        </div>
        <div className="stat-row">
          <span>Collapses:</span>
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
  autoPlay,
  chooseCollapse,
  autoCollapse
}) => {
  const [showStats, setShowStats] = useState(false);

  const renderGameStatus = () => {
    if (isGameOver) {
      if (winner) {
        return (
          <div className="status-card game-over">
            <h3> Game Over!</h3>
            <p className="winner-text">Player {winner} Wins!</p>
          </div>
        );
      } else {
        return (
          <div className="status-card game-over">
            <h3> Game Over!</h3>
            <p className="draw-text">It's a Draw!</p>
            <p style={{ fontSize: '0.85rem', color: '#666' }}>
              All squares filled with no winner
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
          <h3>Quantum Collapse!</h3>
          <p>A cycle was detected in the entanglement graph!</p>
          {cycleCreator && (
            <p><strong>Player {cycleCreator}</strong> created the cycle.</p>
          )}
          <p><strong>Player {choosingPlayer}</strong>, choose how to collapse the quantum moves.</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            (The player who didn't create the cycle chooses)
          </p>
        </div>
      );
    }

    // Use the current player from API state for accuracy
    const currentPlayer = apiGameState?.current_player || gameState.currentPlayer;
    const moveNumber = (apiGameState?.move_count || 0) + 1;

    return (
      <div className="status-card playing">
        <h3>Game in Progress</h3>
        <p>Current Player: <strong>{currentPlayer}</strong></p>
        <p>Move #{moveNumber}</p>
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
            Generating collapse options...
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
        <h4>Choose Collapse Configuration:</h4>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
          Each option shows where quantum moves will collapse to classical positions:
        </p>
        <div className="collapse-options">
          {options.map((option, index) => (
            <div key={index} className="collapse-option">
              <div className="option-header">
                <h5>Option {index + 1}</h5>
              </div>
              <div className="option-assignments">
                {Object.entries(option).map(([moveId, square]) => (
                  <div key={moveId} className="assignment">
                    <strong>{moveId}</strong> → square <strong>{square + 1}</strong>
                  </div>
                ))}
              </div>
              <button
                className="choose-btn"
                onClick={() => chooseCollapse(option)}
              >
                ✓ Choose This
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
        <h2> Control Panel</h2>
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
            Reset Game
          </button>
         
          <button
            className="control-btn toggle-btn"
            onClick={() => setShowStats(!showStats)}
          >
             {showStats ? 'Hide' : 'Show'} Stats
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

      <section className="help-section">
        <details>
          <summary> How to Play</summary>
          <div className="help-content">
            <ol>
              <li><strong>Quantum Moves:</strong> Select 2 squares for each move</li>
              <li><strong>Entanglement:</strong> Sharing squares creates quantum entanglement</li>
              <li><strong>Cycles:</strong> When entanglements form loops, you must choose how to collapse</li>
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

  return (
    <div className="quantum-tictactoe">
      <header className="game-header">
        <h1> Quantum Tic-Tac-Toe</h1>
        <p className="game-subtitle">Experience superposition in a classic game</p>
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