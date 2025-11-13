import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGameState } from '../hooks/useGameState';
import { SQUARE_STATES } from '../types/gameTypes';
import './QuantumTicTacToe.css';
import Navbar from './Navbar';
import Footer from './Footer';
import './QuantumTicTacToe.css';
import GuidePanel from './GuidePanel/GuidePanel';

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

// Main QuantumTicTacToe Component
const QuantumTicTacToe = () => {
  const gameHook = useGameState();

  return (
    <div className="quantum-tictactoe">
      {/* Navbar with language switcher */}
      <Navbar />

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