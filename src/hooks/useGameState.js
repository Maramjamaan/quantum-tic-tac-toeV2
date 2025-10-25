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
  const board = Array(9).fill().map(() => ({
    quantumMoveIds: [],
    classicalMoveId: null,
    state: SQUARE_STATES.EMPTY
  }));

  // First, mark all classical squares from the board
  if (apiGameState.board) {
    apiGameState.board.forEach((player, index) => {
      if (player !== null && player !== undefined) {  // More explicit check
        board[index].classicalMoveId = player;
        board[index].state = SQUARE_STATES.CLASSICAL;
        board[index].quantumMoveIds = [];
        
        console.log(`Square ${index}: Classical ${player}`);  // Debug log
      }
    });
  }

  // Then add quantum moves (only for non-classical squares)
  if (apiGameState.moves) {
    apiGameState.moves.forEach(move => {
      if (!move.collapsed) {
        move.squares.forEach(squareIndex => {
          // Only add quantum moves to non-classical squares
          if (board[squareIndex].state !== SQUARE_STATES.CLASSICAL) {
            board[squareIndex].quantumMoveIds.push(move.move_id);
            board[squareIndex].state = SQUARE_STATES.QUANTUM;
          }
        });
      }
    });
  }

  // Log the final board state for debugging
  console.log('Built board:', board.map((sq, i) => `${i}: ${sq.state} - ${sq.classicalMoveId}`));

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
    totalMoves: apiGameState.move_count || 0,
    quantumMoves,
    classicalMoves,
    entanglements,
    emptySquares,
    classicalSquares,
    moveCount: apiGameState.move_count || 0
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
    classicalSquares: 0,
    moveCount: 0
  };

  // ==========================================
  // GAME STATE CHECKING FUNCTIONS
  // ==========================================

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
      } else if (result.is_draw) {
        console.log(' Draw detected!');

        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.DRAW,
          winner: null
        }));
      }
    }
  }, [api]);

  /**
   * Check if game should end (all squares classical)
   */
  const checkGameEnd = useCallback(async () => {
    // Count empty squares
    const emptyCount = board.filter(sq => 
      sq.state === SQUARE_STATES.EMPTY || sq.classicalMoveId === null
    ).length;
    
    // If less than 2 empty squares, check for game end
    if (emptyCount < 2) {
      console.log(`Less than 2 empty squares (${emptyCount}) - checking game end`);
      
      const result = await api.checkWinner();
      
      if (result && result.success) {
        if (result.winner) {
          console.log('✓ Winner:', result.winner);
          setGameState(prev => ({
            ...prev,
            status: result.winner === 'X' ? GAME_STATUS.X_WINS : GAME_STATUS.O_WINS,
            winner: result.winner
          }));
        } else if (result.is_draw) {
          console.log('✓ Draw: Not enough squares for quantum move');
          setGameState(prev => ({
            ...prev,
            status: GAME_STATUS.DRAW,
            winner: null
          }));
        }
      }
      
      return true;
    }
    return false;
  }, [board, api]);

  // ==========================================
  // PLAYER ACTIONS
  // ==========================================

  /**
   * Execute quantum move via Python API
   */
  const executeQuantumMove = useCallback(async (squares) => {
    if (squares.length !== 2) return;

    // Check if we have available squares
    const availableSquares = board.filter(sq => 
      sq.state !== SQUARE_STATES.CLASSICAL
    );
    
    if (availableSquares.length === 0) {
      console.log(' No squares available for quantum moves');
      await checkGameEnd();
      return;
    }

    console.log('Making quantum move:', squares);
    
    const result = await api.makeQuantumMove(squares[0], squares[1]);
    
    if (result && result.success) {
      console.log(' Move successful');
      
      // Update game state from API response
      setApiGameState(result.game_state);

      // Check if cycle detected
      if (result.cycle_detected) {
        console.log('Cycle detected!');
        console.log('Cycle creator:', result.cycle_creator);
        console.log('Collapse chooser:', result.collapse_chooser);

        const collapseOptions = result.collapse_options || [];

        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.WAITING_COLLAPSE,
          currentPlayer: result.collapse_chooser || result.game_state.current_player,
          cycleCreator: result.cycle_creator,
          collapseChooser: result.collapse_chooser,
          collapseOptions: collapseOptions,
          pendingCycle: {
            id: 'cycle_1',
            moveIds: result.game_state.moves
              .filter(m => !m.collapsed)
              .map(m => m.move_id),
            creator: result.cycle_creator,
            chooser: result.collapse_chooser
          }
        }));

        setApiGameState({
          ...result.game_state,
          collapseOptions: collapseOptions,
          cycleCreator: result.cycle_creator,
          collapseChooser: result.collapse_chooser
        });
      } else {
        // No cycle, continue playing
        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.PLAYING,
          currentPlayer: result.game_state.current_player
        }));
        
        // Check for game end after normal move
        setTimeout(async () => {
          await checkGameEnd();
        }, 100);
      }

      // Clear selection
      setSelectedSquares([]);

    } else {
      console.error(' Move failed');
      setSelectedSquares([]);
    }
  }, [api, board, checkGameEnd]);

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
  }, [gameState, selectedSquares, board, executeQuantumMove]);

  /**
   * Choose a collapse option
   */
  const chooseCollapse = useCallback(async (option) => {
  console.log('Collapsing with chosen option:', option);

  const result = await api.collapseMove(option);

  if (result && result.success) {
    console.log(' Collapse successful:', result.collapse_results);

    // Force complete state update
    setApiGameState(result.game_state);
    
    // Force a game state refresh to ensure sync
    const stateCheck = await api.getGameState();
    if (stateCheck && stateCheck.success) {
      setApiGameState(stateCheck.game_state);
    }

    setGameState(prev => ({
      ...prev,
      status: GAME_STATUS.PLAYING,
      collapseOptions: [],
      pendingCycle: null
    }));

    // Check for winner immediately after collapse
    const winnerCheck = await api.checkWinner();
    if (winnerCheck && winnerCheck.success) {
      if (winnerCheck.winner) {
        console.log(' Winner:', winnerCheck.winner);
        setGameState(prev => ({
          ...prev,
          status: winnerCheck.winner === 'X' ? GAME_STATUS.X_WINS : GAME_STATUS.O_WINS,
          winner: winnerCheck.winner
        }));
        return; // Stop here if there's a winner
      }
    }
        // Check for draw if no winner
    if (winnerCheck && winnerCheck.is_draw) {
      console.log('✓ Draw after collapse');
      setGameState(prev => ({
        ...prev,
        status: GAME_STATUS.DRAW,
        winner: null
      }));
      return;
    }
    // Only check for game end if no winner found
    setTimeout(async () => {
      await checkGameEnd();
    }, 500);
  }
}, [api, checkGameEnd]);

  /**
   * Reset game
   */
  const resetGame = useCallback(async () => {
    console.log('Resetting game...');
    
    // Call API to reset
    const result = await api.resetGame();
    
    if (result && result.success) {
      console.log('Game reset');
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
  }, [api]);

  // ==========================================
  // RETURN EVERYTHING
  // ==========================================

  return {
    // State
    gameState,
    apiGameState,
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