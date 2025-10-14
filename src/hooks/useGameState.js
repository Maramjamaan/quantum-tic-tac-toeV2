/**
 * Game State Management Hook for Quantum Tic-Tac-Toe
 * Connected to Python Quantum Backend via API
 */

import { useState, useCallback, useEffect } from 'react';
import {
  PLAYERS,
  GAME_STATUS,
  SQUARE_STATES,
  createGameState
} from '../types/gameTypes.js';
import { useQuantumAPI } from './useQuantumAPI.js';

// Helper to build board from Python API response
const buildBoardFromAPI = (apiGameState) => {
  const board = Array(9).fill().map(() => ({
    quantumMoveIds: [],
    classicalMoveId: null,
    state: SQUARE_STATES.EMPTY
  }));

  // Add quantum moves
  if (apiGameState.moves) {
    apiGameState.moves.forEach(move => {
      if (!move.collapsed) {
        move.squares.forEach(sq => {
          board[sq].quantumMoveIds.push(move.move_id);
          board[sq].state = SQUARE_STATES.QUANTUM;
        });
      }
    });
  }

  // Add classical moves (collapsed or direct)
  if (apiGameState.board) {
    apiGameState.board.forEach((player, index) => {
      if (player) {
        board[index].classicalMoveId = player;
        board[index].state = SQUARE_STATES.CLASSICAL;
        board[index].quantumMoveIds = [];
      }
    });
  }

  return board;
};

// Calculate stats from game state
const calculateStats = (apiGameState) => {
  const quantumMoves = apiGameState.moves?.filter(m => !m.collapsed).length || 0;
  const classicalMoves = apiGameState.moves?.filter(m => m.collapsed).length || 0;
  const entanglements = apiGameState.entanglements?.length || 0;
  
  const board = apiGameState.board || [];
  const emptySquares = board.filter(sq => sq === null).length;
  const classicalSquares = board.filter(sq => sq !== null).length;
  const quantumSquares = 9 - emptySquares - classicalSquares;

  return {
    totalMoves: quantumMoves + classicalMoves,
    quantumMoves,
    classicalMoves,
    entanglements,
    emptySquares,
    quantumSquares,
    classicalSquares
  };
};

export const useGameState = () => {
  const api = useQuantumAPI();
  
  const [gameState, setGameState] = useState(createGameState());
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [apiGameState, setApiGameState] = useState(null);

  // Get current board representation
  const board = apiGameState ? buildBoardFromAPI(apiGameState) : Array(9).fill().map(() => ({
    quantumMoveIds: [],
    classicalMoveId: null,
    state: SQUARE_STATES.EMPTY
  }));

  const stats = apiGameState ? calculateStats(apiGameState) : {
    totalMoves: 0,
    quantumMoves: 0,
    classicalMoves: 0,
    entanglements: 0,
    emptySquares: 9,
    quantumSquares: 0,
    classicalSquares: 0
  };

  // Handle square selection for quantum moves
  const selectSquare = useCallback((square) => {
    if (gameState.status !== GAME_STATUS.PLAYING) return;
    
    // Check if square is already classical
    const squareData = board[square];
    if (squareData.state === SQUARE_STATES.CLASSICAL) {
      setLastAction({ type: 'error', message: 'Cannot select collapsed square' });
      return;
    }

    const newSelection = [...selectedSquares];
    const existingIndex = newSelection.indexOf(square);

    if (existingIndex >= 0) {
      // Deselect
      newSelection.splice(existingIndex, 1);
    } else if (newSelection.length < 2) {
      // Add to selection
      newSelection.push(square);
    } else {
      // Replace first with new
      newSelection[0] = newSelection[1];
      newSelection[1] = square;
    }

    setSelectedSquares(newSelection);
    
    // Auto-execute if 2 selected
    if (newSelection.length === 2) {
      executeQuantumMove(newSelection);
    }
  }, [gameState, selectedSquares, board]);

  // Execute quantum move via API
  const executeQuantumMove = useCallback(async (squares) => {
    if (squares.length !== 2) return;

    console.log('Making quantum move:', squares);
    
    const result = await api.makeQuantumMove(squares[0], squares[1]);
    
    if (result && result.success) {
      console.log('Move successful:', result);
      setApiGameState(result.game_state);
      
      // Update local game state
      setGameState(prev => ({
        ...prev,
        currentPlayer: result.game_state.current_player,
        status: result.cycle_detected ? GAME_STATUS.WAITING_COLLAPSE : GAME_STATUS.PLAYING
      }));
      
      setSelectedSquares([]);
      
      if (result.cycle_detected) {
        setLastAction({ 
          type: 'cycle_detected',
          message: 'Cycle detected! Choose how to collapse'
        });
      } else {
        setLastAction({ 
          type: 'quantum_move',
          moveId: result.move.move_id,
          squares 
        });
      }
    } else {
      setLastAction({ 
        type: 'error', 
        message: 'Failed to make move' 
      });
      setSelectedSquares([]);
    }
  }, [api]);

  // Choose collapse option
  const chooseCollapse = useCallback(async (option) => {
    console.log('Collapsing with option:', option);
    
    // For now, get all move IDs from API game state
    const moveIds = apiGameState?.moves?.map(m => m.move_id) || [];
    
    const result = await api.collapseMove(moveIds);
    
    if (result && result.success) {
      console.log('Collapse successful:', result);
      setApiGameState(result.game_state);
      
      setGameState(prev => ({
        ...prev,
        status: GAME_STATUS.PLAYING
      }));
      
      setLastAction({ 
        type: 'collapse_applied',
        results: result.collapse_results
      });
    }
  }, [api, apiGameState]);

  // Auto-collapse (just collapse all for now)
  const autoCollapse = useCallback(async () => {
    const moveIds = apiGameState?.moves?.map(m => m.move_id) || [];
    
    if (moveIds.length > 0) {
      const result = await api.collapseMove(moveIds);
      
      if (result && result.success) {
        setApiGameState(result.game_state);
        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.PLAYING
        }));
      }
    }
  }, [api, apiGameState]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedSquares([]);
  }, []);

  // Reset game
  const resetGame = useCallback(async () => {
    console.log('Resetting game...');
    
    const result = await api.resetGame();
    
    if (result && result.success) {
      console.log('Game reset:', result);
      setApiGameState(result.game_state);
      setGameState(createGameState());
      setSelectedSquares([]);
      setLastAction({ type: 'game_reset' });
    }
  }, [api]);

  // Auto-play (simple random move)
  const autoPlay = useCallback(() => {
    if (gameState.status === GAME_STATUS.WAITING_COLLAPSE) {
      autoCollapse();
    } else if (gameState.status === GAME_STATUS.PLAYING) {
      // Find available squares
      const available = [];
      board.forEach((sq, idx) => {
        if (sq.state !== SQUARE_STATES.CLASSICAL) {
          available.push(idx);
        }
      });
      
      if (available.length >= 2) {
        const square1 = available[Math.floor(Math.random() * available.length)];
        let square2;
        do {
          square2 = available[Math.floor(Math.random() * available.length)];
        } while (square2 === square1);
        
        executeQuantumMove([square1, square2]);
      }
    }
  }, [gameState.status, board, autoCollapse, executeQuantumMove]);

  // Load initial game state on mount
  useEffect(() => {
    const loadGameState = async () => {
      const result = await api.getGameState();
      if (result && result.success) {
        setApiGameState(result.game_state);
      }
    };
    
    loadGameState();
  }, []);

  // Clear error messages after delay
  useEffect(() => {
    if (lastAction && lastAction.type === 'error') {
      const timer = setTimeout(() => setLastAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAction]);

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
    chooseCollapse,
    autoCollapse,
    clearSelection,
    resetGame,

    // Utilities
    autoPlay,

    // Computed properties
    isPlaying: gameState.status === GAME_STATUS.PLAYING,
    isWaitingCollapse: gameState.status === GAME_STATUS.WAITING_COLLAPSE,
    isGameOver: gameState.status === GAME_STATUS.X_WINS || 
                gameState.status === GAME_STATUS.O_WINS || 
                gameState.status === GAME_STATUS.DRAW,
    currentPlayer: apiGameState?.current_player || PLAYERS.X,
    winner: gameState.winner,
    winningLine: gameState.winningLine || [],
    
    // API status
    loading: api.loading,
    error: api.error
  };
};