/**
 * useGameState Hook - Main Game Logic
 * ====================================
 * This hook manages the entire game state and connects to the Python API.
 * 
 * What it does:
 * 1. Stores game state (moves, board, current player)
 * 2. Handles player clicking squares
 * 3. Calls Python API for quantum computing
 * 4. Manages collapse when cycles detected
 */

import { useState, useCallback, useEffect } from 'react';
import { PLAYERS, GAME_STATUS, SQUARE_STATES, createGameState } from '../types/gameTypes.js';
import { useQuantumAPI } from './useQuantumAPI.js';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Convert Python API response to board we can display
 */
function buildBoardFromAPI(apiGameState) {
  // Create empty board (9 squares)
  const board = Array(9).fill().map(() => ({
    quantumMoveIds: [],    // List of quantum moves in this square
    classicalMoveId: null,  // Classical move (after collapse)
    state: SQUARE_STATES.EMPTY
  }));

  // Add quantum moves (moves that haven't collapsed yet)
  if (apiGameState.moves) {
    apiGameState.moves.forEach(move => {
      if (!move.collapsed) {
        // This move exists in 2 squares simultaneously!
        move.squares.forEach(squareIndex => {
          board[squareIndex].quantumMoveIds.push(move.move_id);
          board[squareIndex].state = SQUARE_STATES.QUANTUM;
        });
      }
    });
  }

  // Add classical moves (collapsed moves)
  if (apiGameState.board) {
    apiGameState.board.forEach((player, index) => {
      if (player) {
        // This square has a classical move (X or O)
        board[index].classicalMoveId = player;
        board[index].state = SQUARE_STATES.CLASSICAL;
        board[index].quantumMoveIds = []; // Clear quantum moves
      }
    });
  }

  return board;
}

/**
 * Calculate game statistics
 */
function calculateStats(apiGameState) {
  const quantumMoves = apiGameState.moves?.filter(m => !m.collapsed).length || 0;
  const classicalMoves = apiGameState.moves?.filter(m => m.collapsed).length || 0;
  const entanglements = apiGameState.entanglements?.length || 0;
  
  const board = apiGameState.board || [];
  const emptySquares = board.filter(sq => sq === null).length;
  const classicalSquares = board.filter(sq => sq !== null).length;

  return {
    totalMoves: quantumMoves + classicalMoves,
    quantumMoves,
    classicalMoves,
    entanglements,
    emptySquares,
    classicalSquares
  };
}

// ==========================================
// MAIN HOOK
// ==========================================

export const useGameState = () => {
  // Connect to Python API
  const api = useQuantumAPI();
  
  // Local state
  const [gameState, setGameState] = useState(createGameState());
  const [selectedSquares, setSelectedSquares] = useState([]);
  const [apiGameState, setApiGameState] = useState(null);

  // Build board and stats from API data
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
    classicalSquares: 0
  };

  // ==========================================
  // PLAYER ACTIONS
  // ==========================================

  /**
   * Handle when player clicks a square
   */
  const selectSquare = useCallback((square) => {
    // Don't allow clicks if game is over or waiting for collapse
    if (gameState.status !== GAME_STATUS.PLAYING) return;
    
    // Can't click on classical squares
    const squareData = board[square];
    if (squareData.state === SQUARE_STATES.CLASSICAL) {
      console.log('Cannot select collapsed square!');
      return;
    }

    // Update selected squares
    const newSelection = [...selectedSquares];
    const existingIndex = newSelection.indexOf(square);

    if (existingIndex >= 0) {
      // Square already selected → deselect it
      newSelection.splice(existingIndex, 1);
    } else if (newSelection.length < 2) {
      // Less than 2 selected → add this square
      newSelection.push(square);
    } else {
      // Already 2 selected → replace first with new one
      newSelection[0] = newSelection[1];
      newSelection[1] = square;
    }

    setSelectedSquares(newSelection);
    
    // If 2 squares selected, make the move!
    if (newSelection.length === 2) {
      executeQuantumMove(newSelection);
    }
  }, [gameState, selectedSquares, board]);

  /**
   * Execute quantum move via Python API
   */
  const executeQuantumMove = useCallback(async (squares) => {
    if (squares.length !== 2) return;

    console.log('Making quantum move:', squares);
    
    // Call Python API
    const result = await api.makeQuantumMove(squares[0], squares[1]);
    
    if (result && result.success) {
      console.log(' Move successful');
      
      // Update game state from API response
      setApiGameState(result.game_state);
      
      // Check if cycle detected
      if (result.cycle_detected) {
        console.log(' Cycle detected!');
        console.log('Collapse options:', result.collapse_options);
        
        // Update state to show collapse UI
        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.WAITING_COLLAPSE,
          currentPlayer: result.game_state.current_player,
          collapseOptions: result.collapse_options || [],
          pendingCycle: { id: 'cycle_1' }
        }));
      } else {
        // No cycle, continue playing
        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.PLAYING,
          currentPlayer: result.game_state.current_player
        }));
      }
      
      // Clear selection
      setSelectedSquares([]);
      
    } else {
      console.error(' Move failed');
      setSelectedSquares([]);
    }
  }, [api]);
/**
   * Check for winner after moves
   */
   const checkWinner = useCallback(async () => {
    const result = await api.checkWinner();
    
    if (result && result.success) {
      if (result.winner) {
        console.log(' Winner detected:', result.winner);
        
        setGameState(prev => ({
          ...prev,
          status: result.winner === 'X' ? GAME_STATUS.X_WINS : GAME_STATUS.O_WINS,
          winner: result.winner,
          winningLine: result.winning_line || []
        }));
      } else if (result.game_over && !result.winner) {
        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.DRAW
        }));
      }
    }
  }, [api]);

  /**
   * Choose a collapse option
   */
    const chooseCollapse = useCallback(async (option) => {
    console.log('Collapsing with chosen option:', option);
    
    const result = await api.collapseMove(option);
    
    if (result && result.success) {
      console.log('Collapse successful:', result.collapse_results);
      
      setApiGameState(result.game_state);
      
      setGameState(prev => ({
        ...prev,
        status: GAME_STATUS.PLAYING,
        collapseOptions: [],
        pendingCycle: null
      }));
      
      // Check for winner after collapse
      setTimeout(() => checkWinner(), 500);
    } else {
      console.error(' Collapse failed');
    }
  }, [api, checkWinner]);

  // 5. resetGame
  const resetGame = useCallback(async () => {
  
    // Call API to reset
    const result = await api.resetGame();
    
    if (result && result.success) {
      console.log('✅ Game reset');
      setApiGameState(result.game_state);
      setGameState(createGameState());
      setSelectedSquares([]);
    }
  }, [api]);

  /**
   * Clear selected squares
   */
  const clearSelection = useCallback(() => {
    setSelectedSquares([]);
  }, []);

  /**
   * Auto-play (random move for testing)
   */
  const autoPlay = useCallback(() => {
    if (gameState.status === GAME_STATUS.PLAYING) {
      // Find available squares (not classical)
      const available = [];
      board.forEach((sq, idx) => {
        if (sq.state !== SQUARE_STATES.CLASSICAL) {
          available.push(idx);
        }
      });
      
      // Pick 2 random squares
      if (available.length >= 2) {
        const square1 = available[Math.floor(Math.random() * available.length)];
        let square2;
        do {
          square2 = available[Math.floor(Math.random() * available.length)];
        } while (square2 === square1);
        
        executeQuantumMove([square1, square2]);
      }
    }
  }, [gameState.status, board, executeQuantumMove]);

  // ==========================================
  // LOAD INITIAL STATE
  // ==========================================

  useEffect(() => {
    // Load game state from API on mount
    const loadGameState = async () => {
      const result = await api.getGameState();
      if (result && result.success) {
        setApiGameState(result.game_state);
      }
    };
    
    loadGameState();
  }, []);

  // ==========================================
  // RETURN EVERYTHING
  // ==========================================

  return {
    // State
    gameState,
    board,
    stats,
    selectedSquares,

    // Actions
    selectSquare,
    chooseCollapse,
    resetGame,
    clearSelection,
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