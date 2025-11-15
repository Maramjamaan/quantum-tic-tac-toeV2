"""
FastAPI Backend for Quantum Tic-Tac-Toe
Connects React frontend to quantum game engine
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import os

# Import our quantum game engine
from quantum_game import QuantumTicTacToe, create_game

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Quantum Tic-Tac-Toe API",
    description="API for quantum tic-tac-toe game with real quantum computing",
    version="1.0.0"
)

# Enable CORS so React can talk to this API
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], 
    allow_headers=["Content-Type", "Authorization"], 
)

# ==========================================
# GLOBAL GAME INSTANCE
# ==========================================
game_instance: Optional[QuantumTicTacToe] = None


def get_game() -> QuantumTicTacToe:
    """Get or create game instance"""
    global game_instance
    if game_instance is None:
        game_instance = create_game()
        logger.info("New game instance created")
    return game_instance


# ==========================================
# REQUEST/RESPONSE MODELS
# ==========================================

class QuantumMoveRequest(BaseModel):
    """Request to make a quantum move"""
    square1: int
    square2: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "square1": 0,
                "square2": 4
            }
        }


class CollapseMoveRequest(BaseModel):
    """Request to collapse quantum moves with specific squares"""
    collapse_option: Dict[str, int]  # {"X1": 1, "O2": 5, "X3": 9}
    
    class Config:
        json_schema_extra = {
            "example": {
                "collapse_option": {"X1": 1, "O1": 5}
            }
        }


class GameStateResponse(BaseModel):
    """Response with game state"""
    success: bool
    game_state: Dict[str, Any]
    message: Optional[str] = None


# ==========================================
# API ENDPOINTS
# ==========================================

@app.get("/")
def root():
    """Root endpoint - API info"""
    return {
        "name": "Quantum Tic-Tac-Toe API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "GET /": "API info",
            "GET /health": "Health check",
            "POST /game/new": "Start new game",
            "GET /game/state": "Get current game state",
            "POST /game/move": "Make quantum move",
            "POST /game/collapse": "Collapse quantum moves",
            "GET /game/winner": "Check for winner"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "quantum_backend": "operational"
    }


@app.post("/game/new")
def new_game():
    """
    Start a new game
    Resets the game state
    """
    global game_instance
    game_instance = create_game()
    logger.info("New game started")
    
    return {
        "success": True,
        "message": "New game started",
        "game_state": game_instance.get_game_state()
    }


@app.get("/game/state")
def get_game_state():
    """
    Get current game state
    Returns all moves, entanglements, board, etc.
    """
    game = get_game()
    
    return {
        "success": True,
        "game_state": game.get_game_state()
    }


@app.post("/game/move")
def make_quantum_move(request: QuantumMoveRequest):
    """
    Make a quantum move
    Places a quantum mark in two squares simultaneously
    """
    try:
        game = get_game()
        
        # Validate squares
        if not (0 <= request.square1 <= 8 and 0 <= request.square2 <= 8):
            raise HTTPException(
                status_code=400,
                detail="Squares must be between 0 and 8"
            )
        
        if request.square1 == request.square2:
            raise HTTPException(
                status_code=400,
                detail="Squares must be different"
            )
        
        # Make the move
        result = game.make_quantum_move(request.square1, request.square2)
        
        if not result['success']:
            raise HTTPException(
                status_code=400,
                detail=result.get('error', 'Invalid move')
            )
        
        logger.info(f"Quantum move made: {request.square1}, {request.square2}")
        
        # ✅ If cycle detected, generate collapse options
        if result.get('cycle_detected'):
            logger.info('🌀 Cycle detected, generating collapse options...')
            
            # ✅ Generate 3-5 options (reasonable number)
            collapse_options = game.generate_collapse_options(max_options=4)
            
            logger.info(f'✅ Generated {len(collapse_options)} unique collapse options')
            
            # Log each option for debugging
            for i, option in enumerate(collapse_options, 1):
                logger.info(f'  Option {i}: {option}')
            
            result['collapse_options'] = collapse_options
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error making quantum move: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/game/collapse")
def collapse_moves(request: CollapseMoveRequest):
    """
    Collapse quantum moves to chosen classical positions
    
    Args:
        collapse_option: Dictionary mapping move IDs to chosen squares
                        Example: {"X1": 1, "O2": 5, "X3": 9}
    
    Returns:
        Collapse results showing final positions
    """
    try:
        game = get_game()
        
        if not request.collapse_option:
            raise HTTPException(
                status_code=400,
                detail="Must provide collapse option"
            )
        
        logger.info(f"Collapsing with option: {request.collapse_option}")
        
        # Collapse the moves with chosen squares
        result = game.collapse_with_choice(request.collapse_option)
        
        logger.info(f"✅ Collapse successful!")
        logger.info(f"Results: {result['collapse_results']}")
        
        return result
        
    except Exception as e:
        logger.error(f"❌ Error collapsing moves: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/game/winner")
def check_winner():
    """
    Check if there's a winner or a draw
    Returns:
        - winner: 'X', 'O', or None
        - is_draw: True/False
        - game_over: True if game ended
        - board: Current board state
        - winning_line: Indices of winning squares [0-8] if winner exists
    """
    try:
        game = get_game()
        winner = game.check_winner()
        is_draw = game.check_for_draw()
        
        # Find the winning line if there's a winner
        winning_line = []
        if winner:
            winning_combinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
                [0, 4, 8], [2, 4, 6]               # Diagonals
            ]
            
            board = game.game_state.board
            
            for combo in winning_combinations:
                if (board[combo[0]] == board[combo[1]] == board[combo[2]] == winner):
                    winning_line = combo
                    logger.info(f"🏆 Winning line found: {combo} for player {winner}")
                    break
        
        logger.info(f"Check winner result: winner={winner}, draw={is_draw}, line={winning_line}")
        
        return {
            "success": True,
            "winner": winner,
            "is_draw": is_draw,
            "game_over": winner is not None or is_draw,
            "board": game.game_state.board,
            "winning_line": winning_line
        }
        
    except Exception as e:
        logger.error(f"Error checking winner: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/game/entanglements")
def get_entanglements():
    """
    Get all current entanglements
    Useful for visualization
    """
    game = get_game()
    
    return {
        "success": True,
        "entanglements": [e.to_dict() for e in game.game_state.entanglements],
        "count": len(game.game_state.entanglements)
    }


@app.get("/game/moves")
def get_moves():
    """
    Get all moves (quantum and collapsed)
    """
    game = get_game()
    
    return {
        "success": True,
        "moves": [m.to_dict() for m in game.game_state.moves],
        "count": len(game.game_state.moves)
    }


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print(" Starting Quantum Tic-Tac-Toe API Server...")
    print("=" * 50)
    print(" Server: http://localhost:8000")
    print(" API Docs: http://localhost:8000/docs")
    print("Ready to play!\n")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )