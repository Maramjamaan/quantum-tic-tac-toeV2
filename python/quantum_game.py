"""
Quantum Tic-Tac-Toe Game Engine

This file implements quantum computing simulator for the game using Qiskit.

KEY CONCEPTS:
- Superposition: A quantum move exists in 2 squares at once (like Schrödinger's cat)
- Entanglement: When moves share squares, they become connected
- Measurement: Collapsing quantum states to classical positions
- Cycles: When entanglements form a loop, we must collapse

Author: Maram
Date: 2025
"""


# IMPORTS - What libraries we need


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


#DATA CLASSES : 

@dataclass

class QuantumMove:
    # Represents a quantum move in the game
    move_id: str  
    player: str 
    squares: List[int] 
    circuit: Optional[QuantumCircuit] = None  
    collapsed: bool = False  
    final_square: Optional[int] = None  
    amplitude_0: float = 0.707  # Quantum amplitude (√½ = equal probability)
    amplitude_1: float = 0.707  # For 50% chance in each square
    
    def __post_init__(self):
        
        #This runs automatically after creating a QuantumMove
        #It creates the quantum circuit.
        
        if self.circuit is None:
            self.circuit = self._create_quantum_circuit()
    
    def _create_quantum_circuit(self) -> QuantumCircuit:
      
       # Creates real quantum circuit for this move
       # The circuit uses a Hadamard gate (H) to put a qubit in superposition.
       # The ACTUAL quantum computing part
        
        #Returns:A quantum circuit that, when measured, gives 0 or 1 randomly
        
        # Create 1 quantum register (qubit) and 1 classical register (for result)
        qreg = QuantumRegister(1, f'move_{self.move_id}')  # Quantum bit
        creg = ClassicalRegister(1, f'result_{self.move_id}')  # Classical result
        circuit = QuantumCircuit(qreg, creg)  # Combine them
        
        # Apply Hadamard gate: puts qubit in superposition 
        # This is the quantum magic! Now it's (50% 0 + 50% 1)
        circuit.h(qreg[0])
        
        # Add measurement: when we measure, it collapses to 0 or 1
        circuit.measure(qreg[0], creg[0])
        
        return circuit
    
    def to_dict(self) -> Dict:
        # Convert to dictionary for JSON
        return {
            'move_id': self.move_id,
            'player': self.player,
            'squares': self.squares,
            'collapsed': self.collapsed,
            'final_square': self.final_square,
            'amplitude_0': self.amplitude_0,
            'amplitude_1': self.amplitude_1
        }

# Entanglement class
@dataclass
class Entanglement:
   
    #Represents an entanglement between two quantum moves.
    #When two moves share a square, they become entangled!

    move1_id: str
    move2_id: str
    shared_square: int
    
    def to_dict(self) -> Dict:
        #Convert to dictionary for JSON
        return asdict(self)

# GameState class
@dataclass
class GameState:
    
    #The complete state of the game.
    #Everything we need to know about the current game is here!
    
    moves: List[QuantumMove] = field(default_factory=list)  # All moves made
    entanglements: List[Entanglement] = field(default_factory=list)  # All entanglements
    current_player: str = "X"  # Whose turn is it?
    move_count: int = 0  # How many moves have been made?
    board: List[Optional[str]] = field(default_factory=lambda: [None] * 9)  # 9 squares
    
    def to_dict(self) -> Dict:
        #Convert entire game state to dictionary for JSON
        return {
            'moves': [m.to_dict() for m in self.moves],
            'entanglements': [e.to_dict() for e in self.entanglements],
            'current_player': self.current_player,
            'move_count': self.move_count,
            'board': self.board
        }


# MAIN GAME ENGINE
class QuantumTicTacToe:
    #The main game engine that handles all quantum logic!
    
    def __init__(self):
       
        #Initialize a new game.
        #Sets up the quantum simulator and empty game state.
        
        self.backend = AerSimulator()  # Qiskit quantum simulator
        self.game_state = GameState()  # Empty game state
        logger.info("Quantum Tic-Tac-Toe engine initialized")
    
    
    
    # MAKING MOVES
    def make_quantum_move(self, square1: int, square2: int) -> Dict[str, Any]:
        #Make a quantum move in two squares!
        
        # STEP 0: Check if game is already over
        winner = self.check_winner()
        is_draw = self.check_for_draw()
        
        if winner or is_draw:
            # Log why game is over
            if winner:
                logger.info(f"Game over: {winner} wins")
            if is_draw:
                empty = sum(1 for s in self.game_state.board if s is None)
                logger.info(f"Game over: Draw (empty squares: {empty})")
            
            return {
                'success': False,
                'error': 'Game is already over',
                'winner': winner,
                'is_draw': is_draw,
                'game_state': self.game_state.to_dict()
            }
        
        # STEP 1: Check if the move is valid
        if not self._is_valid_quantum_move(square1, square2):
            return {
                'success': False,
                'error': 'Invalid quantum move - squares may already be classical',
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
        # ← MODIFIED: Now returns tuple (bool, List[str])
        cycle_detected, cycle_move_ids = self._check_for_cycles()
        
       
        # STEP 6: If cycle detected, generate collapse options
        collapse_options = []
        if cycle_detected:
            # ← MODIFIED: Pass cycle_move_ids to generate options for this cycle only
            collapse_options = self.generate_collapse_options(max_options=3, cycle_moves=cycle_move_ids)
            logger.info(f"Generated {len(collapse_options)} collapse options")
        
        
        # STEP 7: Handle player switching and cycle logic
        # Store who made this move (they would be the cycle creator if a cycle is detected)
        move_maker = player  # The player who JUST made this move

        if cycle_detected:
            # The player who JUST MADE THIS MOVE created the cycle
            cycle_creator = move_maker
            
            # The OTHER player (opponent) should choose the collapse
            if cycle_creator == "X":
                collapse_chooser = "O"
            else:
                collapse_chooser = "X"
            
            # Set current player to the one who will choose
            self.game_state.current_player = collapse_chooser
            
            logger.info(f" CYCLE LOGIC TRIGGERED!")
            logger.info(f"Move maker (cycle creator): {cycle_creator}")
            logger.info(f"Collapse chooser (opponent): {collapse_chooser}")
        else:
            # Normal move, no cycle - just switch players
            cycle_creator = None
            collapse_chooser = None
            # Switch to the other player for the next move
            self.game_state.current_player = "O" if player == "X" else "X"

        # STEP 8: Return everything
        return {
            'success': True,
            'move': move.to_dict(),
            'entanglements': [e.to_dict() for e in new_entanglements],
            'cycle_detected': cycle_detected,
            'cycle_creator': cycle_creator if cycle_detected else None,
            'collapse_chooser': collapse_chooser if cycle_detected else None,
            'collapse_options': collapse_options,
            'game_state': self.game_state.to_dict()
        }
    



    def collapse_moves(self, moves_to_collapse: List[str]) -> Dict[str, Any]:
        #This function is only used for testing purposes
        #Collapse quantum moves to classical positions.
        
        
        collapse_results = {}
        
        # For each move that needs to collapse
        for move_id in moves_to_collapse:
            move = self._find_move(move_id)
            
            if move and not move.collapsed:
                # RUN THE QUANTUM CIRCUIT, real quantum computing
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
    
    # COLLAPSE WITH PLAYER CHOICE 
    def collapse_with_choice(self, collapse_option: Dict[str, int]) -> Dict[str, Any]:
        #This function is used in the game 
        #Collapse quantum moves to CHOSEN positions (not random!)
        #This is used when the player selects a collapse option.
        #We don't run quantum circuits - we use the player's choice!
        
        
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
  

    # QUANTUM MEASUREMENT
    def _measure_quantum_move(self, move: QuantumMove) -> int:
       
        #We run the quantum circuit and measure the result.
        #The measurement collapses the superposition to either 0 or 1. 
        #ReturnsThe square index where the move collapsed (0-8)
        
        try:
            # Prepare the circuit for the quantum backend
            #make it compatible with the simulator
            transpiled = transpile(move.circuit, self.backend)
            
            # Run it, Execute the quantum circuit once
            # only one shot needed to get a single measurement
            job = self.backend.run(transpiled, shots=1)  # shots=1 means run once
            result = job.result()
            counts = result.get_counts()  # Get the measurement result


            #extract the measured bit
            # The result is either '0' or '1' (as a string)
            measured_bit = int(list(counts.keys())[0])
            
            # Map the bit to actual square:
            # 0 = first square in the list
            # 1 = second square in the list
            final_square = move.squares[measured_bit]
            
            logger.info(f"Quantum measurement: bit={measured_bit}, square={final_square}")
            
            return final_square
            
        except Exception as e:
            # If quantum fails for some reason, use random as backup
            logger.error(f"Quantum measurement failed: {e}")
            import random
            return random.choice(move.squares)
    
    

    # ENTANGLEMENT DETECTION

    
    def _detect_entanglements(self, new_move: QuantumMove) -> List[Entanglement]:
    
       # Find entanglements between the new move and existing moves.
       # Two moves are entangled if they share a square!
        
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
    
    

    # CYCLE DETECTION - Graph Theory!
    # ← FIXED: Proper cycle detection with correct path tracking
    def _check_for_cycles(self) -> Tuple[bool, List[str]]:
       
        #Check if entanglements form a cycle.
        #A cycle is a closed loop in the entanglement graph.
        #Example: X1 -> O1 -> X2 -> X1 (connects back to start)
        #Using DFS with proper path tracking.
        
        # Returns:
        #     (has_cycle: bool, cycle_moves: List[str])
        #     - has_cycle: True if cycle detected
        #     - cycle_moves: List of move IDs in the detected cycle
       
        # STEP 1: Build graph from entanglements (using SET to avoid duplicates)
        graph = {}
        
        for ent in self.game_state.entanglements:
            # Skip if either move is already collapsed
            move1 = self._find_move(ent.move1_id)
            move2 = self._find_move(ent.move2_id)
            if (move1 and move1.collapsed) or (move2 and move2.collapsed):
                continue
            
            # Add nodes if they don't exist (using SET to avoid duplicate edges)
            if ent.move1_id not in graph:
                graph[ent.move1_id] = set()
            if ent.move2_id not in graph:
                graph[ent.move2_id] = set()
            
            # Add edges (using set.add to avoid duplicates)
            graph[ent.move1_id].add(ent.move2_id)
            graph[ent.move2_id].add(ent.move1_id)
        
        # If graph is empty, no cycles possible
        if not graph:
            return (False, [])
        
        # STEP 2: DFS to find cycle with proper path tracking
        visited = set()
        
        def find_cycle_dfs(node: str, parent: str, path: List[str]) -> List[str]:
            """
            DFS that returns the cycle moves if found, empty list otherwise.
            
            Args:
                node: Current node being visited
                parent: Node we came from (to avoid going backwards)
                path: Current path from start node
            
            Returns:
                List of move IDs in cycle, or empty list if no cycle
            """
            visited.add(node)
            path.append(node)
            
            # Check all neighbors
            for neighbor in graph.get(node, set()):
                # Don't go back to parent (that's not a cycle)
                if neighbor == parent:
                    continue
                
                # If neighbor is in current path, we found a cycle!
                if neighbor in path:
                    cycle_start_idx = path.index(neighbor)
                    cycle = path[cycle_start_idx:]  # Extract cycle
                    logger.info(f"Cycle detected: {cycle}")
                    return cycle
                
                # If not visited, continue DFS
                if neighbor not in visited:
                    result = find_cycle_dfs(neighbor, node, path)
                    if result:  # Cycle found in deeper recursion
                        return result
            
            # Backtrack: remove current node from path
            path.pop()
            return []
        
        # STEP 3: Check all uncollapsed moves for cycles
        for move in self.game_state.moves:
            if not move.collapsed and move.move_id in graph:
                if move.move_id not in visited:
                    cycle = find_cycle_dfs(move.move_id, "", [])
                    if cycle:
                        return (True, cycle)
        
        return (False, [])
    
    
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
        
        Note: Allan Goff's paper (Figures 9, 20, 21) shows that multiple quantum 
        moves CAN share the same squares. There is no hard limit on the number 
        of quantum moves per square.
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
    

    # DIVERSE COLLAPSE OPTIONS GENERATION
    #  Added cycle_moves parameter to generate options for specific cycle only
    def generate_collapse_options(self, max_options=5, cycle_moves=None):
       
        #Generate ALL valid collapse options with MAXIMUM DIVERSITY
        
        #This ensures each move appears in different squares across options.
        #Uses complete backtracking to explore all possibilities, then selects the most diverse options.
        
        #  cycle_moves - List of move IDs in the detected cycle
        #  If provided, only generate options for these moves
        #  If None, uses all uncollapsed moves (for backward compatibility)
        
        # Use cycle_moves if provided, otherwise all uncollapsed moves
        if cycle_moves:
            # Use only moves in the detected cycle
            uncollapsed = [m for m in self.game_state.moves 
                          if m.move_id in cycle_moves and not m.collapsed]
            logger.info(f"Generating collapse options for cycle moves: {cycle_moves}")
        else:
            # use all uncollapsed moves (for testing or other purposes)
            uncollapsed = [m for m in self.game_state.moves if not m.collapsed]
            logger.info(f"Generating collapse options for all uncollapsed moves")
            
        if not uncollapsed:
            logger.warning("No uncollapsed moves to generate options for")
            return []
        
        logger.info(f"Generating collapse options for {len(uncollapsed)} uncollapsed moves:")
        for move in uncollapsed:
            logger.info(f"  {move.move_id}: squares {move.squares}")
        
        # Store ALL valid options
        all_options = []
        
        def backtrack(move_index, current_option, used_squares):
            
            #Recursive backtracking to find ALL valid collapse combinations
            """
            Args:
                move_index: Current move we're assigning
                current_option: Current partial assignment {move_id: square}
                used_squares: Set of squares already used in this option
            """
            # Base case: all moves assigned successfully
            if move_index == len(uncollapsed):
                # Save this valid option
                all_options.append(current_option.copy())
                return
            
            # Get current move
            move = uncollapsed[move_index]
            
            # Try EACH square this move can collapse to
            for square in move.squares:
                # Skip if this square is already used by another move
                if square in used_squares:
                    continue
                
                # Assign this square to current move
                current_option[move.move_id] = square
                used_squares.add(square)
                
                # Recurse to assign next move
                backtrack(move_index + 1, current_option, used_squares)
                
                # Backtrack: undo this assignment
                del current_option[move.move_id]
                used_squares.remove(square)
        
        # Start the backtracking algorithm
        backtrack(0, {}, set())
        
        logger.info(f" Generated {len(all_options)} total valid combinations")
        
        # If we have few options, return them all
        if len(all_options) <= max_options:
            for i, option in enumerate(all_options, 1):
                logger.info(f"  Option {i}: {option}")
            return all_options
        
        #  Pick the most diverse options
        # We want each move to appear in different squares across options
        
        selected_options = []
        # Always include the first option
        selected_options.append(all_options[0])
        
        # Select remaining options to maximize diversity
        for _ in range(min(max_options - 1, len(all_options) - 1)):
            best_option = None
            max_diversity_score = -1
            
            # Find option that differs most from already selected options
            for candidate in all_options:
                # Skip if already selected
                if candidate in selected_options:
                    continue
                
                # Calculate diversity score
                diversity_score = 0
                for selected in selected_options:
                    for move_id in candidate:
                        # +1 point for each move that's in a different square
                        if candidate[move_id] != selected.get(move_id):
                            diversity_score += 1
                
                # Keep track of best option
                if diversity_score > max_diversity_score:
                    max_diversity_score = diversity_score
                    best_option = candidate
            
            # Add the most diverse option found
            if best_option:
                selected_options.append(best_option)
        
        logger.info(f"Selected {len(selected_options)} diverse options:")
        for i, option in enumerate(selected_options, 1):
            logger.info(f"  Option {i}: {option}")
        
        return selected_options
    
    def reset_game(self):
        # Reset game to initial state
        self.game_state = GameState()
        logger.info("Game reset")
    
    
    def get_game_state(self) -> Dict:
        # Get current game state as dictionary
        return self.game_state.to_dict()


    # WINNER AND DRAW CHECKING
    def check_winner(self) -> Optional[str]:
        
        # Check if there's a winner.
        # Only CLASSICAL moves count! Quantum moves don't count for winning.
        
        
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
    
    def check_for_draw(self) -> bool:
        # Check if game is a draw.
        # Draw when: no winner AND (board full OR less than 2 empty squares)
        
        # If someone won, not a draw
        winner = self.check_winner()
        if winner:
            return False
        
        # Count empty squares
        empty_squares = sum(1 for square in self.game_state.board if square is None)
        
        # Draw if:
        # 1. Board completely full (0 empty)
        # 2. Less than 2 empty squares (can't make quantum move)
        if empty_squares < 2:
            return True
        
        return False
    

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
    
    print("Quantum Tic-Tac-Toe Engine Test\n")
    
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
        print("\n Collapsing quantum moves...")
        move_ids = [m['move_id'] for m in result['game_state']['moves']]
        collapse_result = game.collapse_moves(move_ids)
        print(f"Collapse results: {collapse_result['collapse_results']}")
        print(f"Board: {game.game_state.board}")
    
    print("\n Engine test complete!")