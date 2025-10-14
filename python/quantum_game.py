"""
Quantum Tic-Tac-Toe Game Engine
Complete implementation using Qiskit for real quantum computing
"""

import json
import logging
from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass, asdict, field
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit.quantum_info import Statevector
from qiskit_aer import AerSimulator
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==========================================
# DATA STRUCTURES
# ==========================================

@dataclass
class QuantumMove:
    """Represents a quantum move in superposition"""
    move_id: str
    player: str
    squares: List[int]  # Two squares where move exists
    circuit: Optional[QuantumCircuit] = None
    collapsed: bool = False
    final_square: Optional[int] = None
    amplitude_0: float = 0.707  # √(1/2) for equal superposition
    amplitude_1: float = 0.707
    
    def __post_init__(self):
        """Initialize quantum circuit for this move"""
        if self.circuit is None:
            self.circuit = self._create_quantum_circuit()
    
    def _create_quantum_circuit(self) -> QuantumCircuit:
        """Create quantum circuit representing superposition between two squares"""
        qreg = QuantumRegister(1, f'move_{self.move_id}')
        creg = ClassicalRegister(1, f'result_{self.move_id}')
        circuit = QuantumCircuit(qreg, creg)
        
        # Put qubit in equal superposition: (|0⟩ + |1⟩)/√2
        circuit.h(qreg[0])
        
        # Add measurement
        circuit.measure(qreg[0], creg[0])
        
        return circuit
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization"""
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
    """Represents entanglement between two quantum moves"""
    move1_id: str
    move2_id: str
    shared_square: int
    
    def to_dict(self) -> Dict:
        return asdict(self)


@dataclass
class GameState:
    """Complete game state"""
    moves: List[QuantumMove] = field(default_factory=list)
    entanglements: List[Entanglement] = field(default_factory=list)
    current_player: str = "X"
    move_count: int = 0
    board: List[Optional[str]] = field(default_factory=lambda: [None] * 9)
    
    def to_dict(self) -> Dict:
        return {
            'moves': [m.to_dict() for m in self.moves],
            'entanglements': [e.to_dict() for e in self.entanglements],
            'current_player': self.current_player,
            'move_count': self.move_count,
            'board': self.board
        }


# ==========================================
# QUANTUM GAME ENGINE
# ==========================================

class QuantumTicTacToe:
    """Main quantum game engine"""
    
    def __init__(self):
        self.backend = AerSimulator()
        self.game_state = GameState()
        logger.info("Quantum Tic-Tac-Toe engine initialized")
    
    # ====================================
    # CORE GAME FUNCTIONS
    # ====================================
    
    def make_quantum_move(self, square1: int, square2: int) -> Dict[str, Any]:
        """
        Make a quantum move in two squares
        
        Args:
            square1: First square (0-8)
            square2: Second square (0-8)
            
        Returns:
            Dictionary with move information and game state
        """
        # Validate input
        if not self._is_valid_quantum_move(square1, square2):
            return {
                'success': False,
                'error': 'Invalid quantum move',
                'game_state': self.game_state.to_dict()
            }
        
        # Create move ID
        player = self.game_state.current_player
        move_number = self.game_state.move_count + 1
        move_id = f"{player}{move_number}"
        
        # Create quantum move
        move = QuantumMove(
            move_id=move_id,
            player=player,
            squares=[square1, square2]
        )
        
        # Add to game state
        self.game_state.moves.append(move)
        self.game_state.move_count += 1
        
        # Check for entanglements
        new_entanglements = self._detect_entanglements(move)
        self.game_state.entanglements.extend(new_entanglements)
        
        # Check if cycle formed (needs collapse)
        cycle_detected = self._check_for_cycles()
        
        # Switch player
        self.game_state.current_player = "O" if player == "X" else "X"
        
        logger.info(f"Quantum move {move_id} placed in squares {square1} and {square2}")
        
        return {
            'success': True,
            'move': move.to_dict(),
            'entanglements': [e.to_dict() for e in new_entanglements],
            'cycle_detected': cycle_detected,
            'game_state': self.game_state.to_dict()
        }
    
    def collapse_moves(self, moves_to_collapse: List[str]) -> Dict[str, Any]:
        """
        Collapse quantum moves to classical positions
        Uses real quantum measurement
        
        Args:
            moves_to_collapse: List of move IDs to collapse
            
        Returns:
            Dictionary with collapse results
        """
        collapse_results = {}
        
        for move_id in moves_to_collapse:
            move = self._find_move(move_id)
            if move and not move.collapsed:
                # Measure quantum circuit
                final_square = self._measure_quantum_move(move)
                
                # Update move
                move.collapsed = True
                move.final_square = final_square
                
                # Update board
                self.game_state.board[final_square] = move.player
                
                collapse_results[move_id] = final_square
                
                logger.info(f"Move {move_id} collapsed to square {final_square}")
        
        return {
            'success': True,
            'collapse_results': collapse_results,
            'game_state': self.game_state.to_dict()
        }
    
    # ====================================
    # QUANTUM MEASUREMENT
    # ====================================
    
    def _measure_quantum_move(self, move: QuantumMove) -> int:
        """
        Execute quantum circuit and measure result
        
        Returns:
            The square index where move collapsed (0-8)
        """
        try:
            # Transpile circuit for backend
            transpiled = transpile(move.circuit, self.backend)
            
            # Execute circuit (single shot)
            job = self.backend.run(transpiled, shots=1)
            result = job.result()
            counts = result.get_counts()
            
            # Get measurement result (0 or 1)
            measured_bit = int(list(counts.keys())[0])
            
            # Map to actual square
            final_square = move.squares[measured_bit]
            
            logger.info(f"Quantum measurement: bit={measured_bit}, square={final_square}")
            
            return final_square
            
        except Exception as e:
            logger.error(f"Quantum measurement failed: {e}")
            # Fallback to random if quantum fails
            import random
            return random.choice(move.squares)
    
    # ====================================
    # ENTANGLEMENT DETECTION
    # ====================================
    
    def _detect_entanglements(self, new_move: QuantumMove) -> List[Entanglement]:
        """
        Detect entanglements between new move and existing moves
        
        Args:
            new_move: The newly placed move
            
        Returns:
            List of new entanglements created
        """
        entanglements = []
        
        for existing_move in self.game_state.moves:
            # Skip the same move
            if existing_move.move_id == new_move.move_id:
                continue
            
            # Skip collapsed moves
            if existing_move.collapsed:
                continue
            
            # Check for shared squares
            shared_squares = set(new_move.squares) & set(existing_move.squares)
            
            for shared_square in shared_squares:
                entanglement = Entanglement(
                    move1_id=existing_move.move_id,
                    move2_id=new_move.move_id,
                    shared_square=shared_square
                )
                entanglements.append(entanglement)
                logger.info(f"Entanglement detected: {existing_move.move_id} ⟷ {new_move.move_id} at square {shared_square}")
        
        return entanglements
    
    # ====================================
    # CYCLE DETECTION
    # ====================================
    
    def _check_for_cycles(self) -> bool:
        """
        Check if entanglements form a cycle (requires collapse)
        Uses graph theory - DFS to find cycles
        
        Returns:
            True if cycle exists, False otherwise
        """
        # Build adjacency graph from entanglements
        graph = {}
        for ent in self.game_state.entanglements:
            if ent.move1_id not in graph:
                graph[ent.move1_id] = []
            if ent.move2_id not in graph:
                graph[ent.move2_id] = []
            
            graph[ent.move1_id].append(ent.move2_id)
            graph[ent.move2_id].append(ent.move1_id)
        
        # DFS to detect cycle
        visited = set()
        rec_stack = set()
        
        def has_cycle_dfs(node: str, parent: Optional[str] = None) -> bool:
            visited.add(node)
            rec_stack.add(node)
            
            for neighbor in graph.get(node, []):
                if neighbor == parent:  # Skip back edge to parent
                    continue
                
                if neighbor in rec_stack:  # Back edge = cycle!
                    logger.info(f"Cycle detected involving move {node}")
                    return True
                
                if neighbor not in visited:
                    if has_cycle_dfs(neighbor, node):
                        return True
            
            rec_stack.remove(node)
            return False
        
        # Check all connected components
        for move in self.game_state.moves:
            if not move.collapsed and move.move_id not in visited:
                if has_cycle_dfs(move.move_id):
                    return True
        
        return False
    
    # ====================================
    # VALIDATION HELPERS
    # ====================================
    
    def _is_valid_quantum_move(self, square1: int, square2: int) -> bool:
        """Check if quantum move is valid"""
        # Check range
        if not (0 <= square1 <= 8 and 0 <= square2 <= 8):
            return False
        
        # Must be different squares
        if square1 == square2:
            return False
        
        # Cannot place on collapsed squares
        if self.game_state.board[square1] is not None:
            return False
        if self.game_state.board[square2] is not None:
            return False
        
        return True
    
    def _find_move(self, move_id: str) -> Optional[QuantumMove]:
        """Find move by ID"""
        for move in self.game_state.moves:
            if move.move_id == move_id:
                return move
        return None
    
    # ====================================
    # GAME STATUS
    # ====================================
    
    def check_winner(self) -> Optional[str]:
        """
        Check if there's a winner (only collapsed moves count!)
        
        Returns:
            'X', 'O', or None
        """
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]               # Diagonals
        ]
        
        board = self.game_state.board
        
        for combo in winning_combinations:
            if (board[combo[0]] == board[combo[1]] == board[combo[2]] 
                and board[combo[0]] is not None):
                return board[combo[0]]
        
        return None
    
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
    """Create new game instance"""
    return QuantumTicTacToe()


def serialize_game_state(game: QuantumTicTacToe) -> str:
    """Serialize game state to JSON"""
    return json.dumps(game.get_game_state(), indent=2)


# ==========================================
# MAIN (for testing)
# ==========================================

if __name__ == "__main__":
    # Quick test
    game = create_game()
    
    print("🎮 Quantum Tic-Tac-Toe Engine Test\n")
    
    # Player X move
    result = game.make_quantum_move(0, 4)
    print(f"Move X1: squares 0 and 4")
    print(f"Entanglements: {len(result['entanglements'])}")
    
    # Player O move
    result = game.make_quantum_move(4, 8)
    print(f"\nMove O1: squares 4 and 8")
    print(f"Entanglements: {len(result['entanglements'])}")
    print(f"Cycle detected: {result['cycle_detected']}")
    
    # Collapse if cycle detected
    if result['cycle_detected']:
        print("\n🔄 Collapsing quantum moves...")
        collapse_result = game.collapse_moves(['X1', 'O1'])
        print(f"Collapse results: {collapse_result['collapse_results']}")
        print(f"Board: {game.game_state.board}")
    
    print("\n✅ Engine test complete!")