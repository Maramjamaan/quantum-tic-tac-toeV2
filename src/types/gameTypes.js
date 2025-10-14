/**
 * Type definitions for Quantum Tic-Tac-Toe
 * Based on Allan Goff's paper
 */

// Basic enums
export const PLAYERS = {
  X: 'X',
  O: 'O'
};

export const MOVE_TYPES = {
  QUANTUM: 'quantum',
  CLASSICAL: 'classical'
};

export const GAME_STATUS = {
  PLAYING: 'playing',
  WAITING_COLLAPSE: 'waiting_collapse',
  X_WINS: 'x_wins',
  O_WINS: 'o_wins',
  DRAW: 'draw'
};

export const SQUARE_STATES = {
  EMPTY: 'empty',
  QUANTUM: 'quantum',
  CLASSICAL: 'classical',
  SELECTED: 'selected'
};

// Quantum move - exists in 2 squares until collapsed
export class QuantumMove {
  constructor(player, moveNum, squares) {
    if (squares.length !== 2 || squares[0] === squares[1]) {
      throw new Error('Invalid quantum move: must be exactly 2 different squares');
    }
    
    this.id = `${player}${moveNum}`;
    this.player = player;
    this.moveNumber = moveNum;
    this.squares = squares.sort();
    this.collapsed = false;
    this.finalSquare = null;
    this.timestamp = Date.now();
  }

  hasSquare(sq) {
    return this.squares.includes(sq);
  }

  // Add this method
  collapse(sq) {
    if (!this.hasSquare(sq)) {
      throw new Error(`Move ${this.id} cannot collapse to square ${sq}`);
    }
    this.collapsed = true;
    this.finalSquare = sq;
  }

  getOtherSquare(sq) {
    if (!this.hasSquare(sq)) return null;
    return this.squares.find(s => s !== sq);
  }
}
// Classical move - definite position after collapse or direct play
export class ClassicalMove {
  constructor(player, square, fromQuantumId = null) {
    this.id = `${player}_classical_${square}_${Date.now()}`;
    this.player = player;
    this.square = square;
    this.fromQuantumId = fromQuantumId; // track origin if from collapse
    this.timestamp = Date.now();
  }
}

// Entanglement between two quantum moves sharing a square
export class Entanglement {
  constructor(move1Id, move2Id, sharedSquare) {
    // ensure consistent ordering
    const [first, second] = [move1Id, move2Id].sort();
    
    this.id = `${first}_${second}_${sharedSquare}`;
    this.move1Id = first;
    this.move2Id = second;
    this.sharedSquare = sharedSquare;
    this.timestamp = Date.now();
  }

  involves(moveId) {
    return this.move1Id === moveId || this.move2Id === moveId;
  }

  getOther(moveId) {
    if (this.move1Id === moveId) return this.move2Id;
    if (this.move2Id === moveId) return this.move1Id;
    throw new Error(`Move ${moveId} not in this entanglement`);
  }
}

// Cycle in entanglement graph - triggers collapse
export class EntanglementCycle {
  constructor(moveIds, entanglements, triggerMoveId) {
    this.id = `cycle_${Date.now()}`;
    this.moveIds = moveIds;
    this.entanglements = entanglements;
    this.triggerMoveId = triggerMoveId;
    this.triggerPlayer = triggerMoveId.charAt(0);
    this.timestamp = Date.now();
  }

  // Player who gets to choose collapse (not the one who triggered)
  getCollapsePlayer() {
    return this.triggerPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
  }

  size() {
    return this.moveIds.length;
  }
}

// Option for how to collapse a cycle
export class CollapseOption {
  constructor(cycleId, moveAssignments) {
    this.id = `option_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.cycleId = cycleId;
    this.assignments = new Map(moveAssignments); // moveId -> square
    this.score = 0; // evaluation score
  }

  getSquare(moveId) {
    return this.assignments.get(moveId) || null;
  }

  setScore(score) {
    this.score = score;
  }
}

// Main game state structure
export const createGameState = () => ({
  status: GAME_STATUS.PLAYING,
  currentPlayer: PLAYERS.X,
  quantumMoves: [],
  classicalMoves: [],
  entanglements: [],
  pendingCycle: null,
  collapseOptions: [],
  selectedSquares: [],
  winner: null,
  winningLine: [],
  moveCount: 0,
  history: []
});

// Square data structure
export const createSquare = () => ({
  quantumMoveIds: [],
  classicalMoveId: null,
  state: SQUARE_STATES.EMPTY
});

// Create empty board
export const createBoard = () => Array(9).fill().map(() => createSquare());

// Validation functions
export const isValidSquare = (sq) => 
  Number.isInteger(sq) && sq >= 0 && sq <= 8;

export const isValidPlayer = (player) => 
  player === PLAYERS.X || player === PLAYERS.O;

export const isValidQuantumMove = (squares) =>
  Array.isArray(squares) && 
  squares.length === 2 && 
  squares.every(isValidSquare) && 
  squares[0] !== squares[1];

// Action types for state management
export const ACTIONS = {
  MAKE_QUANTUM_MOVE: 'MAKE_QUANTUM_MOVE',
  MAKE_CLASSICAL_MOVE: 'MAKE_CLASSICAL_MOVE',
  SELECT_SQUARE: 'SELECT_SQUARE',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  DETECT_CYCLE: 'DETECT_CYCLE',
  CHOOSE_COLLAPSE: 'CHOOSE_COLLAPSE',
  APPLY_COLLAPSE: 'APPLY_COLLAPSE',
  RESET_GAME: 'RESET_GAME'
};

// Game constants
export const BOARD_SIZE = 9;
export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];
export const MAX_QUANTUM_PER_SQUARE = 8;
export const MIN_MOVES_FOR_CYCLE = 3;