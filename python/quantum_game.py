"""
Quantum Tic-Tac-Toe Game Engine
================================
This file implements REAL quantum computing for the game using Qiskit.

KEY CONCEPTS:
- Superposition: A quantum move exists in 2 squares at once (like Schrödinger's cat)
- Entanglement: When moves share squares, they become connected
- Measurement: Collapsing quantum states to classical positions
- Cycles: When entanglements form a loop, we must collapse

Author: Maram
Date: 2025
"""

# ==========================================
# IMPORTS - What libraries we need
# ==========================================

import json  # For converting Python objects to JSON (for API)
import logging  # For printing debug messages
from typing import List, Dict, Optional, Tuple, Any  # Type hints for better code
from dataclasses import dataclass, asdict, field  # Easy way to create data structures

# Qiskit imports - The quantum computing library
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit_aer import AerSimulator  # Simulates a quantum computer
import numpy as np  # Math library

# Set up logging so we can see what's happening
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)


# ==========================================
# DATA STRUCTURES - How we store game data
# ==========================================

@dataclass
class QuantumMove:
    """
    Represents ONE quantum move in the game.
    
    Example: Player X places move X1 in squares 0 and 4
    This means X1 exists in BOTH squares simultaneously until it collapses!
    
    Attributes:
        move_id: Unique ID like "X1", "O2", etc.
        player: "X" or "O"
        squares: List of 2 squares [0, 4] means squares 0 AND 4
        circuit: The actual quantum circuit (created automatically)
        collapsed: False = still quantum, True = collapsed to classical
        final_square: After collapse, which square did it land in?
    """
    move_id: str  # Example: "X1"
    player: str  # "X" or "O"
    squares: List[int]  # [0, 4] means squares 0 and 4
    circuit: Optional[QuantumCircuit] = None  # Quantum circuit (created below)
    collapsed: bool = False  # Has it collapsed yet?
    final_square: Optional[int] = None  # Where did it collapse to?
    amplitude_0: float = 0.707  # Quantum amplitude (√½ = equal probability)
    amplitude_1: float = 0.707  # For 50% chance in each square
    
    def __post_init__(self):
        """
        This runs automatically after creating a QuantumMove.
        It creates the quantum circuit.
        """
        if self.circuit is None:
            self.circuit = self._create_quantum_circuit()
    
    def _create_quantum_circuit(self) -> QuantumCircuit:
        """
        Creates a REAL quantum circuit for this move!
        
        The circuit uses a Hadamard gate (H) to put a qubit in superposition.
        This is the ACTUAL quantum computing part!
        
        Returns:
            A quantum circuit that, when measured, gives 0 or 1 randomly
        """
        # Create 1 quantum register (qubit) and 1 classical register (for result)
        qreg = QuantumRegister(1, f'move_{self.move_id}')  # Quantum bit
        creg = ClassicalRegister(1, f'result_{self.move_id}')  # Classical result
        circuit = QuantumCircuit(qreg, creg)  # Combine them
        
        # Apply Hadamard gate: puts qubit in superposition (|0⟩ + |1⟩)/√2
        # This is the quantum magic! Now it's 50% |0⟩ and 50% |1⟩
        circuit.h(qreg[0])
        
        # Add measurement: when we measure, it collapses to 0 or 1
        circuit.measure(qreg[0], creg[0])
        
        return circuit
    
    def to_dict(self) -> Dict:
        """Convert this move to a dictionary for JSON"""
        return {
            'move_id': self.move_id,
            'player': self.player,
            'squares': self.squares,
            'collapsed': self.collapsed,
            'final_square': self.final_square,
            'amplitude_0': self.amplitude_0,
            'amplitude_1': self.amplitude_1
        }


@dataclass
class Entanglement:
    """
    Represents an entanglement between two quantum moves.
    
    When two moves share a square, they become entangled!
    Example: X1 in [0,4] and O1 in [4,8] are entangled at square 4
    
    Attributes:
        move1_id: First move (e.g., "X1")
        move2_id: Second move (e.g., "O1")
        shared_square: The square they both share (e.g., 4)
    """
    move1_id: str
    move2_id: str
    shared_square: int
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON"""
        return asdict(self)


@dataclass
class GameState:
    """
    The complete state of the game.
    Everything we need to know about the current game is here!
    """
    moves: List[QuantumMove] = field(default_factory=list)  # All moves made
    entanglements: List[Entanglement] = field(default_factory=list)  # All entanglements
    current_player: str = "X"  # Whose turn is it?
    move_count: int = 0  # How many moves have been made?
    board: List[Optional[str]] = field(default_factory=lambda: [None] * 9)  # 9 squares
    
    def to_dict(self) -> Dict:
        """Convert entire game state to dictionary for JSON"""
        return {
            'moves': [m.to_dict() for m in self.moves],
            'entanglements': [e.to_dict() for e in self.entanglements],
            'current_player': self.current_player,
            'move_count': self.move_count,
            'board': self.board
        }


# ==========================================
# MAIN GAME ENGINE
# ==========================================

class QuantumTicTacToe:
    """
    The main game engine that handles all quantum logic!
    """
    
    def __init__(self):
        """
        Initialize a new game.
        Sets up the quantum simulator and empty game state.
        """
        self.backend = AerSimulator()  # Qiskit quantum simulator
        self.game_state = GameState()  # Empty game state
        logger.info("Quantum Tic-Tac-Toe engine initialized")
    
    
    # ====================================
    # MAKING MOVES
    # ====================================
    
    def make_quantum_move(self, square1: int, square2: int) -> Dict[str, Any]:
        """
        Make a quantum move in two squares!
        
        This is called when a player clicks 2 squares.
        
        Args:
            square1: First square (0-8)
            square2: Second square (0-8)
            
        Returns:
            Dictionary with:
            - success: True/False
            - move: The move that was created
            - entanglements: New entanglements created
            - cycle_detected: Whether a cycle was formed
            - collapse_options: Options for how to collapse (if cycle detected)
            - game_state: Complete game state
        """
        # STEP 1: Check if the move is valid
        if not self._is_valid_quantum_move(square1, square2):
            return {
                'success': False,
                'error': 'Invalid quantum move',
                'game_state': self.game_state.to_dict()
            }
        
        # STEP 2: Create the move
        player = self.game_state.current_player  # X or O
        move_number = self.game_state.move_count + 1  # Move 1, 2, 3...
        move_id = f"{player}{move_number}"  # X1, O1, X2, etc.
        
        # Create the QuantumMove object (this creates the quantum circuit!)
        move = QuantumMove(
            move_id=move_id,
            player=player,
            squares=[square1, square2]
        )
        
        # STEP 3: Add move to game state
        self.game_state.moves.append(move)
        self.game_state.move_count += 1
        
        # STEP 4: Check for new entanglements
        # If this move shares a square with another move, they're entangled!
        new_entanglements = self._detect_entanglements(move)
        self.game_state.entanglements.extend(new_entanglements)
        
        # STEP 5: Check if a cycle formed
        # A cycle is when entanglements form a closed loop (A→B→C→A)
        cycle_detected = self._check_for_cycles()
        
        # STEP 6: If cycle detected, generate collapse options
      # If cycle detected, generate VALID collapse options
        collapse_options = []
        if cycle_detected:
            import random
            # Get all uncollapsed moves
            uncollapsed_moves = [m for m in self.game_state.moves if not m.collapsed]
            
            # Generate up to 10 attempts to find valid options
            attempts = 0
            max_attempts = 50
            
            while len(collapse_options) < 3 and attempts < max_attempts:
                attempts += 1
                option = {}
                used_squares = set()  # Track which squares are used
                valid = True
                
                # Try to assign each move to a square
                for m in uncollapsed_moves:
                    # Try both squares for this move
                    available = [sq for sq in m.squares if sq not in used_squares]
                    
                    if available:
                        # Pick a random available square
                        chosen = random.choice(available)
                        option[m.move_id] = chosen
                        used_squares.add(chosen)
                    else:
                        # No available squares - this option is invalid
                        valid = False
                        break
                
                # Only add if valid and not duplicate
                if valid and option not in collapse_options:
                    collapse_options.append(option)
            
            # If we couldn't generate 3 options, that's ok - use what we have
            logger.info(f"Generated {len(collapse_options)} valid collapse options")
        
        # STEP 7: Switch to other player
        # If cycle detected, DON'T switch player yet!
        # The OTHER player (not the one who triggered cycle) chooses collapse
        if not cycle_detected:
            # Normal move, switch player
            self.game_state.current_player = "O" if player == "X" else "X"
        # If cycle detected, current_player stays the same (they triggered it)
        # So the OTHER player will be the one choosing collapse
        
        logger.info(f"Quantum move {move_id} placed in squares {square1} and {square2}")
        
        # STEP 8: Return everything
        return {
            'success': True,
            'move': move.to_dict(),
            'entanglements': [e.to_dict() for e in new_entanglements],
            'cycle_detected': cycle_detected,
            'collapse_options': collapse_options,
            'game_state': self.game_state.to_dict()
        }
    
    
    def collapse_moves(self, moves_to_collapse: List[str]) -> Dict[str, Any]:
        """
        Collapse quantum moves to classical positions.
        This is where we actually RUN the quantum circuits!
        
        Args:
            moves_to_collapse: List of move IDs like ["X1", "O1", "X2"]
            
        Returns:
            Dictionary with collapse results
        """
        collapse_results = {}
        
        # For each move that needs to collapse
        for move_id in moves_to_collapse:
            move = self._find_move(move_id)
            
            if move and not move.collapsed:
                # RUN THE QUANTUM CIRCUIT! This is the real quantum computing!
                final_square = self._measure_quantum_move(move)
                
                # Update the move
                move.collapsed = True
                move.final_square = final_square
                
                # Update the board (now it's classical, not quantum)
                self.game_state.board[final_square] = move.player
                
                collapse_results[move_id] = final_square
                
                logger.info(f"Move {move_id} collapsed to square {final_square}")
        
        return {
            'success': True,
            'collapse_results': collapse_results,
            'game_state': self.game_state.to_dict()
        }
    
    def collapse_with_choice(self, collapse_option: Dict[str, int]) -> Dict[str, Any]:
        """
        Collapse quantum moves to CHOSEN positions (not random!)
        
        This is used when the player selects a collapse option.
        We don't run quantum circuits - we use the player's choice!
        
        Args:
            collapse_option: Dictionary like {"X1": 1, "O2": 5, "X3": 9}
                            Maps move_id to the chosen square
            
        Returns:
            Dictionary with collapse results
        """
        collapse_results = {}
        
        # For each move in the chosen option
        for move_id, chosen_square in collapse_option.items():
            move = self._find_move(move_id)
            
            if move and not move.collapsed:
                # Verify the chosen square is valid for this move
                if chosen_square not in move.squares:
                    logger.error(f"Invalid choice: {move_id} cannot collapse to {chosen_square}")
                    continue
                
                # Use the CHOSEN square (not quantum measurement!)
                final_square = chosen_square
                
                # Update the move
                move.collapsed = True
                move.final_square = final_square
                
                # Update the board
                self.game_state.board[final_square] = move.player
                
                collapse_results[move_id] = final_square
                
                logger.info(f"Move {move_id} collapsed to chosen square {final_square}")
        
        return {
            'success': True,
            'collapse_results': collapse_results,
            'game_state': self.game_state.to_dict()
        }
    # ====================================
    # QUANTUM MEASUREMENT - THE MAGIC!
    # ====================================
    
    def _measure_quantum_move(self, move: QuantumMove) -> int:
        """
        This is where the REAL quantum computing happens!
        
        We run the quantum circuit and measure the result.
        The measurement collapses the superposition to either 0 or 1.
        
        Args:
            move: The QuantumMove to measure
            
        Returns:
            The square index where the move collapsed (0-8)
        """
        try:
            # Prepare the circuit for the quantum backend
            transpiled = transpile(move.circuit, self.backend)
            
            # RUN IT! Execute the quantum circuit once
            job = self.backend.run(transpiled, shots=1)  # shots=1 means run once
            result = job.result()
            counts = result.get_counts()  # Get the measurement result
            
            # The result is either '0' or '1' (as a string)
            measured_bit = int(list(counts.keys())[0])
            
            # Map the bit to actual square:
            # 0 → first square in the list
            # 1 → second square in the list
            final_square = move.squares[measured_bit]
            
            logger.info(f"Quantum measurement: bit={measured_bit}, square={final_square}")
            
            return final_square
            
        except Exception as e:
            # If quantum fails for some reason, use random as backup
            logger.error(f"Quantum measurement failed: {e}")
            import random
            return random.choice(move.squares)
    
    
    # ====================================
    # ENTANGLEMENT DETECTION
    # ====================================
    
    def _detect_entanglements(self, new_move: QuantumMove) -> List[Entanglement]:
        """
        Find entanglements between the new move and existing moves.
        
        Two moves are entangled if they share a square!
        Example: X1 in [0,4] and O1 in [4,8] share square 4 → entangled!
        
        Args:
            new_move: The move we just placed
            
        Returns:
            List of new Entanglement objects
        """
        entanglements = []
        
        # Check every existing move
        for existing_move in self.game_state.moves:
            # Skip if it's the same move
            if existing_move.move_id == new_move.move_id:
                continue
            
            # Skip if it already collapsed
            if existing_move.collapsed:
                continue
            
            # Find shared squares using set intersection
            # Example: {0, 4} & {4, 8} = {4} → they share square 4!
            shared_squares = set(new_move.squares) & set(existing_move.squares)
            
            # For each shared square, create an entanglement
            for shared_square in shared_squares:
                entanglement = Entanglement(
                    move1_id=existing_move.move_id,
                    move2_id=new_move.move_id,
                    shared_square=shared_square
                )
                entanglements.append(entanglement)
                logger.info(f"Entanglement: {existing_move.move_id} ⟷ {new_move.move_id} at square {shared_square}")
        
        return entanglements
    
    
    # ====================================
    # CYCLE DETECTION - Graph Theory!
    # ====================================
    
    def _check_for_cycles(self) -> bool:
        """
        Check if entanglements form a cycle.
        
        A cycle is a closed loop in the entanglement graph.
        Example: X1→O1→X2→X1 (connects back to start)
        
        We use Depth-First Search (DFS) to find cycles.
        This is a graph theory algorithm!
        
        Returns:
            True if a cycle exists, False otherwise
        """
        # STEP 1: Build a graph from entanglements
        # Graph structure: {move_id: [connected_move_ids]}
        graph = {}
        
        for ent in self.game_state.entanglements:
            # Add nodes if they don't exist
            if ent.move1_id not in graph:
                graph[ent.move1_id] = []
            if ent.move2_id not in graph:
                graph[ent.move2_id] = []
            
            # Add edges (connections) in both directions
            graph[ent.move1_id].append(ent.move2_id)
            graph[ent.move2_id].append(ent.move1_id)
        
        # STEP 2: Use DFS to detect cycles
        visited = set()  # Moves we've checked
        rec_stack = set()  # Current path we're exploring
        
        def has_cycle_dfs(node: str, parent: Optional[str] = None) -> bool:
            """
            Depth-First Search to find cycles.
            
            Args:
                node: Current move we're checking
                parent: The move we came from (to avoid going backwards)
                
            Returns:
                True if we found a cycle
            """
            visited.add(node)
            rec_stack.add(node)
            
            # Check all neighbors (connected moves)
            for neighbor in graph.get(node, []):
                # Don't go back to parent (that's not a cycle)
                if neighbor == parent:
                    continue
                
                # If neighbor is in our current path, we found a cycle!
                if neighbor in rec_stack:
                    logger.info(f"Cycle detected involving move {node}")
                    return True
                
                # If we haven't visited this neighbor, explore it
                if neighbor not in visited:
                    if has_cycle_dfs(neighbor, node):
                        return True
            
            # Done with this path, remove from recursion stack
            rec_stack.remove(node)
            return False
        
        # STEP 3: Check all moves for cycles
        for move in self.game_state.moves:
            if not move.collapsed and move.move_id not in visited:
                if has_cycle_dfs(move.move_id):
                    return True
        
        return False
    
    
    # ====================================
    # VALIDATION HELPERS
    # ====================================
    
    def _is_valid_quantum_move(self, square1: int, square2: int) -> bool:
        """
        Check if a quantum move is valid.
        
        Rules:
        - Both squares must be 0-8
        - Squares must be different
        - Squares must not have classical moves already
        """
        # Check if squares are in valid range
        if not (0 <= square1 <= 8 and 0 <= square2 <= 8):
            return False
        
        # Must be different squares
        if square1 == square2:
            return False
        
        # Cannot place on squares that already have classical moves
        if self.game_state.board[square1] is not None:
            return False
        if self.game_state.board[square2] is not None:
            return False
        
        return True
    
    
    def _find_move(self, move_id: str) -> Optional[QuantumMove]:
        """Find a move by its ID"""
        for move in self.game_state.moves:
            if move.move_id == move_id:
                return move
        return None
    
    
    # ====================================
    # GAME STATUS
    # ====================================
    
    def check_winner(self) -> Optional[str]:
        """
        Check if there's a winner.
        
        Only CLASSICAL moves count! Quantum moves don't count for winning.
        
        Returns:
            'X', 'O', or None
        """
        # All possible winning combinations
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]               # Diagonals
        ]
        
        board = self.game_state.board
        
        # Check each winning combination
        for combo in winning_combinations:
            # If all 3 squares have the same player and are not empty
            if (board[combo[0]] == board[combo[1]] == board[combo[2]] 
                and board[combo[0]] is not None):
                return board[combo[0]]  # Return the winning player
        
        return None  # No winner yet
    
    
    def reset_game(self):
        """Reset game to initial state"""
        self.game_state = GameState()
        logger.info("Game reset")
    
    
    def get_game_state(self) -> Dict:
        """Get current game state as dictionary"""
        return self.game_state.to_dict()


# ==========================================
# CONVENIENCE FUNCTIONS
# ==========================================

def create_game() -> QuantumTicTacToe:
    """Create a new game instance"""
    return QuantumTicTacToe()


# ==========================================
# TESTING CODE
# ==========================================

if __name__ == "__main__":
    """
    This code runs when you execute: python quantum_game.py
    It's a quick test to make sure everything works!
    """
    game = create_game()
    
    print("🎮 Quantum Tic-Tac-Toe Engine Test\n")
    
    # Player X makes first move
    result = game.make_quantum_move(0, 4)
    print(f"Move X1: squares 0 and 4")
    print(f"Entanglements: {len(result['entanglements'])}")
    
    # Player O makes second move
    result = game.make_quantum_move(4, 8)
    print(f"\nMove O1: squares 4 and 8")
    print(f"Entanglements: {len(result['entanglements'])}")
    print(f"Cycle detected: {result['cycle_detected']}")
    
    # Player X makes third move - creates cycle!
    result = game.make_quantum_move(8, 0)
    print(f"\nMove X2: squares 8 and 0")
    print(f"Cycle detected: {result['cycle_detected']}")
    
    # If cycle detected, collapse
    if result['cycle_detected']:
        print("\n🔄 Collapsing quantum moves...")
        move_ids = [m['move_id'] for m in result['game_state']['moves']]
        collapse_result = game.collapse_moves(move_ids)
        print(f"Collapse results: {collapse_result['collapse_results']}")
        print(f"Board: {game.game_state.board}")
    
    print("\n✅ Engine test complete!")