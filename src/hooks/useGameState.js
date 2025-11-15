/**
 * useGameState Hook - Main Game Logic
 * ====================================
 * This hook manages the entire game state and connects to the Python API.
 */
import { MIN_SQUARES_FOR_MOVE, COLLAPSE_DELAY } from '../constants/gameConstants';
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
      if (player !== null && player !== undefined) {
        board[index].classicalMoveId = player;
        board[index].state = SQUARE_STATES.CLASSICAL;
        board[index].quantumMoveIds = [];

        console.log(`Square ${index}: Classical ${player}`);
      }
    });
  }

  // Then add quantum moves (only for non-classical squares)
  if (apiGameState.moves) {
    apiGameState.moves.forEach(move => {
      if (!move.collapsed) {
        move.squares.forEach(squareIndex => {
          if (board[squareIndex].state !== SQUARE_STATES.CLASSICAL) {
            board[squareIndex].quantumMoveIds.push(move.move_id);
            board[squareIndex].state = SQUARE_STATES.QUANTUM;
          }
        });
      }
    });
  }

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
  const [userError, setUserError] = useState(null);

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
   * Check for winner and update game state
   * Returns true if game ended (winner or draw), false otherwise
   */
  const checkWinner = useCallback(async () => {
    const result = await api.checkWinner();

    if (result && result.success) {
      if (result.winner) {
        console.log(' Winner detected:', result.winner);
        console.log(' Winning line:', result.winning_line);

        setGameState(prev => ({
          ...prev,
          status: result.winner === 'X' ? GAME_STATUS.X_WINS : GAME_STATUS.O_WINS,
          winner: result.winner,
          winningLine: result.winning_line || []
        }));
        return true;
      } else if (result.is_draw) {
        console.log(' Draw detected!');

        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.DRAW,
          winner: null
        }));
        return true;
      }
    }

    return false;
  }, [api]);

  /**
   * Check if game should end (all squares classical)
   */
  const checkGameEnd = useCallback(async () => {
    const emptyCount = board.filter(sq =>
      sq.state === SQUARE_STATES.EMPTY || sq.classicalMoveId === null
    ).length;

    if ((emptyCount < MIN_SQUARES_FOR_MOVE)) {
      console.log(`Less than 2 empty squares (${emptyCount}) - checking game end`);

      await checkWinner();

      return true;
    }
    return false;
  }, [board, checkWinner]);

  // ==========================================
  // PLAYER ACTIONS
  // ==========================================

  /**
   * Execute quantum move via Python API
   */
  const executeQuantumMove = useCallback(async (squares) => {
    if (squares.length !== 2) return;

    setUserError(null);

    // Check if we have available squares
    const availableSquares = board.filter(sq =>
      sq.state !== SQUARE_STATES.CLASSICAL
    );

    if (availableSquares.length === 0) {
      console.log('⚠️ No squares available for quantum moves');
      setUserError('ERROR_NO_SQUARES');
      await checkGameEnd();
      return;
    }

    console.log('Making quantum move:', squares);

    try {
      const result = await api.makeQuantumMove(squares[0], squares[1]);

      if (!result) {
        setUserError('ERROR_SERVER_DOWN');
        setSelectedSquares([]);
        return;
      }

      if (result && result.success) {
        console.log('✓ Move successful');

        setApiGameState(result.game_state);

        if (result.cycle_detected) {
          console.log(' Cycle detected!');
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
          setGameState(prev => ({
            ...prev,
            status: GAME_STATUS.PLAYING,
            currentPlayer: result.game_state.current_player
          }));

          setTimeout(async () => {
            await checkGameEnd();
          }, COLLAPSE_DELAY);
        }

        setSelectedSquares([]);

      } else {
        console.error(' Move failed');
        setUserError(result.error || 'ERROR_MOVE_FAILURE');
        setSelectedSquares([]);
      }

    } catch (error) {
      console.error(' Error in executeQuantumMove:', error);
      setUserError('ERROR_MOVE_FAILURE');
      setSelectedSquares([]);
    }
  }, [api, board, checkGameEnd]);

  /**
   * Handle when player clicks a square
   */
  const selectSquare = useCallback((square) => {
    if (gameState.status !== GAME_STATUS.PLAYING) return;

    const squareData = board[square];
    if (squareData.state === SQUARE_STATES.CLASSICAL) {
      console.log('Cannot select collapsed square!');
      return;
    }

    const newSelection = [...selectedSquares];
    const existingIndex = newSelection.indexOf(square);

    if (existingIndex >= 0) {
      newSelection.splice(existingIndex, 1);
    } else if (newSelection.length < 2) {
      newSelection.push(square);
    } else {
      newSelection[0] = newSelection[1];
      newSelection[1] = square;
    }

    setSelectedSquares(newSelection);

    if (newSelection.length === 2) {
      executeQuantumMove(newSelection);
    }
  }, [gameState, selectedSquares, board, executeQuantumMove]);


  /**
  * Choose a collapse option
  */
  const chooseCollapse = useCallback(async (option) => {
    console.log('Collapsing with chosen option:', option);

    setUserError(null);

    try {
      const result = await api.collapseMove(option);

      if (!result) {
        setUserError('ERROR_COLLAPSE_FAILURE');
        return;
      }

      if (result && result.success) {
        console.log('✓ Collapse successful:', result.collapse_results);

        // Step 1: Update the board state immediately
        setApiGameState(result.game_state);

        // Step 2: Check for winner BEFORE changing game state
        const winnerResult = await api.checkWinner();

        if (winnerResult && winnerResult.success) {
          if (winnerResult.winner) {
            console.log(' Winner after collapse:', winnerResult.winner);

            setGameState(prev => ({
              ...prev,
              status: winnerResult.winner === 'X' ? GAME_STATUS.X_WINS : GAME_STATUS.O_WINS,
              winner: winnerResult.winner,
              winningLine: winnerResult.winning_line || [],
              collapseOptions: [],
              pendingCycle: null
            }));

            return; // Game ended, stop here
          }

          if (winnerResult.is_draw) {
            console.log(' Draw after collapse');

            setGameState(prev => ({
              ...prev,
              status: GAME_STATUS.DRAW,
              winner: null,
              collapseOptions: [],
              pendingCycle: null
            }));

            return; // Game ended, stop here
          }
        }

        // Step 3: No winner yet, refresh state and continue playing
        const stateCheck = await api.getGameState();
        if (stateCheck && stateCheck.success) {
          setApiGameState(stateCheck.game_state);
        }

        setGameState(prev => ({
          ...prev,
          status: GAME_STATUS.PLAYING,
          currentPlayer: result.game_state.current_player,
          collapseOptions: [],
          pendingCycle: null
        }));

        // Step 4: Check if game should end (board full)
        setTimeout(async () => {
          await checkGameEnd();
        }, 500);

      } else {
        setUserError(result.error || 'ERROR_COLLAPSE_FAILURE');
      }
    } catch (error) {
      console.error(' Error in chooseCollapse:', error);
      setUserError('ERROR_COLLAPSE_FAILURE');
    }
  }, [api, checkGameEnd]);

  /**
   * Reset game
   */
  const resetGame = useCallback(async () => {
    console.log('Resetting game...');

    setUserError(null);

    try {
      const result = await api.resetGame();

      if (!result) {
        setUserError('ERROR_RESET_FAILURE');
        return;
      }

      if (result && result.success) {
        console.log('✓ Game reset');
        setApiGameState(result.game_state);
        setGameState(createGameState());
        setSelectedSquares([]);
      } else {
        setUserError(result.error || 'ERROR_RESET_FAILURE');
      }
    } catch (error) {
      console.error('💥 Error in resetGame:', error);
      setUserError('ERROR_RESET_FAILURE');
    }
  }, [api]);

  /**
   * Clear selected squares
   */
  const clearSelection = useCallback(() => {
    setSelectedSquares([]);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setUserError(null);
  }, []);

  /**
   * Auto-play (random move for testing)
   */
  const autoPlay = useCallback(() => {
    if (gameState.status === GAME_STATUS.PLAYING) {
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
  }, [gameState.status, board, executeQuantumMove]);

 // ==========================================
// LOAD INITIAL STATE
// ==========================================

useEffect(() => {
  let isMounted = true;
  
  const loadGameState = async () => {
    try {
      const result = await api.getGameState();
      if (result && result.success && isMounted) {
        setApiGameState(result.game_state);
      }
    } catch (error) {
      console.error('Failed to load initial game state:', error);
    }
  };

  loadGameState();
  
  return () => {
    isMounted = false;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ✅ We only want this to run once on mount
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
    userError,

    // Actions
    selectSquare,
    chooseCollapse,
    resetGame,
    clearSelection,
    clearError,
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