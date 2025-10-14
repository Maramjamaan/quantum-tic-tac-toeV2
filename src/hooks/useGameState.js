/**
 * Game State Management Hook for Quantum Tic-Tac-Toe
 * Central state management with all game logic integration
 */

import { useState, useCallback, useEffect } from 'react';
import {
  PLAYERS,
  GAME_STATUS,
  SQUARE_STATES,
  createGameState,
  isValidQuantumMove
} from '../types/gameTypes.js';
import {
  canMakeQuantumMove,
  makeQuantumMove,
  makeClassicalMove,
  buildBoard,
  checkWinner,
  updateStatus,
  getStats
} from '../utils/gameLogic.js';
import { detectCycle } from '../utils/entanglementDetector.js';
import {
  generateCollapseOptions,
  applyCollapse,
  getBestOption,
  evaluateOption
} from '../utils/collapseEngine.js';

export const useGameState = () => {
  const [gameState, setGameState] = useState(createGameState());
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  // Get current board representation
  const board = buildBoard(gameState);
  const stats = getStats(gameState);

  // Handle square selection for quantum moves
  const selectSquare = useCallback((square) => {
    if (gameState.status !== GAME_STATUS.PLAYING) return;
    
    // Check if square is already classical (can't select)
    const squareData = board[square];
    if (squareData.state === SQUARE_STATES.CLASSICAL) {
      setLastAction({ type: 'error', message: 'Cannot select collapsed square' });
      return;
    }

    const newSelection = [...selectedSquares];
    const existingIndex = newSelection.indexOf(square);

    if (existingIndex >= 0) {
      // Deselect if already selected
      newSelection.splice(existingIndex, 1);
    } else if (newSelection.length < 2) {
      // Add to selection if room available
      newSelection.push(square);
    } else {
      // Replace first selected with new one
      newSelection[0] = newSelection[1];
      newSelection[1] = square;
    }

    setSelectedSquares(newSelection);
    
    // Auto-execute move if 2 squares selected
    if (newSelection.length === 2) {
      executeQuantumMove(newSelection);
    }
  }, [gameState, selectedSquares, board]);

  // Execute a quantum move
  const executeQuantumMove = useCallback((squares) => {
    if (!canMakeQuantumMove(gameState, squares, gameState.currentPlayer)) {
      setLastAction({ 
        type: 'error', 
        message: 'Invalid quantum move' 
      });
      return;
    }

    const newState = makeQuantumMove(gameState, squares, gameState.currentPlayer);
    if (!newState) {
      setLastAction({ type: 'error', message: 'Failed to make move' });
      return;
    }

    // Check for new cycles
    const lastMove = newState.quantumMoves[newState.quantumMoves.length - 1];
    const cycle = detectCycle(newState.entanglements, lastMove.id);

    if (cycle) {
      // Generate collapse options
      const options = generateCollapseOptions(cycle, newState);
      const updatedState = {
        ...newState,
        status: GAME_STATUS.WAITING_COLLAPSE,
        pendingCycle: cycle,
        collapseOptions: options
      };
      
      setGameState(updatedState);
      setSelectedSquares([]);
      setLastAction({ 
        type: 'cycle_detected', 
        cycle,
        choosingPlayer: cycle.getCollapsePlayer()
      });
    } else {
      // No cycle - update status and continue
      const finalState = updateStatus(newState);
      setGameState(finalState);
      setSelectedSquares([]);
      setLastAction({ 
        type: 'quantum_move', 
        moveId: lastMove.id,
        squares 
      });
    }
  }, [gameState]);

  // Execute classical move (mainly for testing)
  const executeClassicalMove = useCallback((square, player) => {
    const newState = makeClassicalMove(gameState, square, player);
    if (!newState) return false;

    const finalState = updateStatus(newState);
    setGameState(finalState);
    setLastAction({ type: 'classical_move', square, player });
    return true;
  }, [gameState]);

  // Choose collapse option
  const chooseCollapse = useCallback((option) => {
    if (gameState.status !== GAME_STATUS.WAITING_COLLAPSE || !gameState.pendingCycle) {
      setLastAction({ type: 'error', message: 'No collapse pending' });
      return;
    }

    const newState = applyCollapse(gameState, option);
    const finalState = updateStatus(newState);
    
    setGameState(finalState);
    setLastAction({ 
      type: 'collapse_applied', 
      option,
      impact: option.assignments.size 
    });
  }, [gameState]);

  // Auto-choose best collapse option (for AI or quick play)
  const autoCollapse = useCallback(() => {
    if (gameState.status !== GAME_STATUS.WAITING_COLLAPSE) return;

    const choosingPlayer = gameState.pendingCycle.getCollapsePlayer();
    const bestOption = getBestOption(
      gameState.collapseOptions, 
      choosingPlayer, 
      gameState
    );

    if (bestOption) {
      chooseCollapse(bestOption);
    }
  }, [gameState, chooseCollapse]);

  // Clear current selection
  const clearSelection = useCallback(() => {
    setSelectedSquares([]);
    setLastAction({ type: 'selection_cleared' });
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setGameState(createGameState());
    setSelectedSquares([]);
    setLastAction({ type: 'game_reset' });
  }, []);

  // Undo last move (for testing/development)
  const undoMove = useCallback(() => {
    // This would require maintaining move history
    // For now, just clear selections
    clearSelection();
    setLastAction({ type: 'undo_attempted' });
  }, [clearSelection]);

  // Get available moves for current player
  const getAvailableMoves = useCallback(() => {
    if (gameState.status !== GAME_STATUS.PLAYING) return [];

    const available = [];
    
    // Check all possible 2-square combinations
    for (let i = 0; i < 9; i++) {
      for (let j = i + 1; j < 9; j++) {
        if (canMakeQuantumMove(gameState, [i, j], gameState.currentPlayer)) {
          available.push([i, j]);
        }
      }
    }

    return available;
  }, [gameState]);

  // Check if a specific move is valid
  const isMoveValid = useCallback((squares) => {
    return isValidQuantumMove(squares) && 
           canMakeQuantumMove(gameState, squares, gameState.currentPlayer);
  }, [gameState]);

  // Get move suggestions (simple AI)
  const getMoveSuggestions = useCallback(() => {
    const availableMoves = getAvailableMoves();
    if (availableMoves.length === 0) return [];

    // Score each move roughly
    const scoredMoves = availableMoves.map(squares => {
      let score = 0;
      
      // Prefer center squares
      if (squares.includes(4)) score += 3;
      
      // Prefer corners
      const corners = [0, 2, 6, 8];
      score += squares.filter(sq => corners.includes(sq)).length * 2;
      
      // Prefer moves that create entanglements (more complex)
      const currentBoard = buildBoard(gameState);
      squares.forEach(sq => {
        if (currentBoard[sq].quantumMoveIds && currentBoard[sq].quantumMoveIds.length > 0) {
          score += 1;
        }
      });

      return { squares, score };
    });

    // Sort by score and return top 3
    return scoredMoves
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.squares);
  }, [gameState, getAvailableMoves]);

  // Auto-play functionality (for testing)
  const autoPlay = useCallback(() => {
    if (gameState.status === GAME_STATUS.WAITING_COLLAPSE) {
      autoCollapse();
    } else if (gameState.status === GAME_STATUS.PLAYING) {
      const suggestions = getMoveSuggestions();
      if (suggestions.length > 0) {
        const randomMove = suggestions[Math.floor(Math.random() * suggestions.length)];
        selectSquare(randomMove[0]);
        setTimeout(() => selectSquare(randomMove[1]), 100);
      }
    }
  }, [gameState.status, autoCollapse, getMoveSuggestions, selectSquare]);

  // Effect to auto-clear last action after delay
  useEffect(() => {
    if (lastAction && lastAction.type === 'error') {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

  // Debug info (remove in production)
  const debugInfo = {
    entanglements: gameState.entanglements ? gameState.entanglements.length : 0,
    pendingCycle: !!gameState.pendingCycle,
    collapseOptions: gameState.collapseOptions ? gameState.collapseOptions.length : 0,
    lastAction: lastAction?.type
  };

  return {
    // Core state
    gameState,
    board,
    stats,
    selectedSquares,
    lastAction,

    // Actions
    selectSquare,
    executeQuantumMove,
    executeClassicalMove,
    chooseCollapse,
    autoCollapse,
    clearSelection,
    resetGame,
    undoMove,

    // Queries
    getAvailableMoves,
    isMoveValid,
    getMoveSuggestions,

    // Utilities
    autoPlay,
    debugInfo,

    // Computed properties
    isPlaying: gameState.status === GAME_STATUS.PLAYING,
    isWaitingCollapse: gameState.status === GAME_STATUS.WAITING_COLLAPSE,
    isGameOver: gameState.status === GAME_STATUS.X_WINS || 
                gameState.status === GAME_STATUS.O_WINS || 
                gameState.status === GAME_STATUS.DRAW,
    currentPlayer: gameState.currentPlayer,
    winner: gameState.winner,
    winningLine: gameState.winningLine
  };
};