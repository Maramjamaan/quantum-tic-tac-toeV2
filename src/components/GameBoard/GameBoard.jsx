import React from 'react';
import { SQUARE_STATES } from '../types/gameTypes';

// GameBoard Component with dual winning lines support
const GameBoard = ({ 
  board, 
  gameState, 
  selectedSquares, 
  selectSquare, 
  currentPlayer, 
  isPlaying, 
  winningLine = [],
  xWinningLine = [],  // ✅ NEW: X's winning line (green glow)
  oWinningLine = []   // ✅ NEW: O's winning line (purple glow)
}) => {
  const renderSquare = (index) => {
    const square = board[index];
    const isSelected = selectedSquares.includes(index);
    
    // ✅ Check which winning line(s) this square belongs to
    const isXWinning = xWinningLine.includes(index);
    const isOWinning = oWinningLine.includes(index);
    const isWinning = winningLine.includes(index) || isXWinning || isOWinning;
    
    const getSquareClass = () => {
      let classes = ['square'];
      
      if (isSelected) classes.push('selected');
      
      // ✅ Different classes for X and O winning lines
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
      <div className="game-board">
        <div className="board-grid">
          {Array(9).fill().map((_, index) => renderSquare(index))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;