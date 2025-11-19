
/**
 * Game Type Definitions
 *  Based on Allan Goff's paper
 * Central place for all game-related constants and types
 */




// PLAYERS

export const PLAYERS = {
  X: 'X',
  O: 'O'
};
// MOVE TYPES
export const MOVE_TYPES = {
  QUANTUM: 'quantum',
  CLASSICAL: 'classical'
};


// GAME STATUS
export const GAME_STATUS = {
  // are in one of these states during gameplay
  PLAYING: 'playing',// start of game or ongoing
  WAITING_COLLAPSE: 'waiting_collapse', // occures when a cycle is detected
  X_WINS: 'x_wins',
  O_WINS: 'o_wins',
  DRAW: 'draw'// no more moves possible and no winner
};

// SQUARE STATES
export const SQUARE_STATES = {
  QUANTUM: 'quantum', // contains quantum moves
  CLASSICAL: 'classical', // one move after collapse 
};

// Quantum move class 
export class QuantumMove {
  constructor(player, moveNum, squares) {
    // check squares validity
    if (squares.length !== 2 || squares[0] === squares[1]) {
      throw new Error('Invalid quantum move: must be exactly 2 different squares');
    }
    
    this.id = `${player}${moveNum}`; // e.g., "X1", "O2"
    this.player = player;// 'X' or 'O'
    this.moveNumber = moveNum;// sequential move number for the player
    this.squares = squares.sort();// always store in sorted order
    this.collapsed = false;// has this move been collapsed?
    this.finalSquare = null;// if collapsed, which square it settled on
    this.timestamp = Date.now();// move creation time
  }

  //check if move are in a given square
  hasSquare(sq) {
    return this.squares.includes(sq);
  }

  // collapse move to a specific square
  collapse(sq) {
    if (!this.hasSquare(sq)) {
      throw new Error(`Move ${this.id} cannot collapse to square ${sq}`);
    }
    this.collapsed = true;
    this.finalSquare = sq;
  }
  // get the second square 
  getOtherSquare(sq) {
    if (!this.hasSquare(sq)) return null;
    return this.squares.find(s => s !== sq);
  }
}


// Classical move class - definite position after collapse or direct play
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
  // check if a move is part of this entanglement
  involves(moveId) {
    return this.move1Id === moveId || this.move2Id === moveId;
  }
  // get the other move in the entanglement
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
    this.moveIds = moveIds; // array of move IDs in the cycle
    this.entanglements = entanglements;// array of Entanglement objects forming the cycle
    this.triggerMoveId = triggerMoveId;// move that caused cycle detection
    this.triggerPlayer = triggerMoveId.charAt(0);// 'X' or 'O' that triggered the cycle
    this.timestamp = Date.now();
  }

  // Player who gets to choose collapse (not the one who triggered)
  getCollapsePlayer() {
    return this.triggerPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
  }
  // number of moves in the cycle
  size() {
    return this.moveIds.length;
  }
}

// Option for how to collapse a cycle
export class CollapseOption {
  constructor(cycleId, moveAssignments) {
    this.id = `option_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.cycleId = cycleId;
    this.assignments = new Map(moveAssignments); // Map of moveId -> square
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

// make empty square
export const createSquare = () => ({
  quantumMoveIds: [],
  classicalMoveId: null,
  state: SQUARE_STATES.EMPTY
});

//make empty board
export const createBoard = () => 
  Array(9).fill().map(() => createSquare());

// make sure square index is valid
export const isValidSquare = (sq) => 
  Number.isInteger(sq) && sq >= 0 && sq <= 8;

// make sure its the valid player
export const isValidPlayer = (player) => 
  player === PLAYERS.X || player === PLAYERS.O;
// make sure that quantum move squares are valid
export const isValidQuantumMove = (squares) =>
  Array.isArray(squares) && // must be an array
  squares.length === 2 && // exactly 2 squares
  squares.every(isValidSquare) && // each square valid
  squares[0] !== squares[1];// squares must be different

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

// Other game constants
export const BOARD_SIZE = 9;
export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];
export const MAX_QUANTUM_PER_SQUARE = 8;
export const MIN_MOVES_FOR_CYCLE = 3;



/*
هذا الملف يحتوي على التعريفات المركزية للعبة، مبني على ورقة 
بحثية لـ Allan Goff. يشمل الثوابت، الـ Classes للكائنات، 
ودوال المساعدة اللازمة لإدارة حالة اللعبة.*/