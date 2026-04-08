from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import os
import uuid

from quantum_game import QuantumTicTacToe, create_game

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Quantum Tic-Tac-Toe API",
    description="API for quantum tic-tac-toe game with real quantum computing",
    version="1.0.0"
)

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,https://q-tic-tac-toe.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

# ==========================================
# SESSION-BASED GAME STORAGE
# ==========================================
games: Dict[str, QuantumTicTacToe] = {}

def get_game(session_id: str) -> QuantumTicTacToe:
    if session_id not in games:
        games[session_id] = create_game()
        logger.info(f"New game created for session: {session_id}")
    return games[session_id]


# ==========================================
# REQUEST MODELS
# ==========================================

class QuantumMoveRequest(BaseModel):
    square1: int
    square2: int

class CollapseMoveRequest(BaseModel):
    collapse_option: Dict[str, int]


# ==========================================
# ENDPOINTS
# ==========================================

@app.get("/")
def root():
    return {
        "name": "Quantum Tic-Tac-Toe API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "quantum_backend": "operational"}


@app.post("/game/new")
def new_game(session_id: Optional[str] = Query(default=None)):
    sid = session_id or str(uuid.uuid4())
    games[sid] = create_game()
    logger.info(f"New game started for session: {sid}")
    return {
        "success": True,
        "session_id": sid,
        "message": "New game started",
        "game_state": games[sid].get_game_state()
    }


@app.get("/game/state")
def get_game_state(session_id: str = Query(...)):
    game = get_game(session_id)
    return {"success": True, "game_state": game.get_game_state()}


@app.post("/game/move")
def make_quantum_move(request: QuantumMoveRequest, session_id: str = Query(...)):
    try:
        game = get_game(session_id)

        if not (0 <= request.square1 <= 8 and 0 <= request.square2 <= 8):
            raise HTTPException(status_code=400, detail="Squares must be between 0 and 8")

        if request.square1 == request.square2:
            raise HTTPException(status_code=400, detail="Squares must be different")

        result = game.make_quantum_move(request.square1, request.square2)

        if not result['success']:
            return result

        if result.get('cycle_detected'):
            collapse_options = game.generate_collapse_options(max_options=4)
            result['collapse_options'] = collapse_options

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error making quantum move: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/game/collapse")
def collapse_moves(request: CollapseMoveRequest, session_id: str = Query(...)):
    try:
        game = get_game(session_id)

        if not request.collapse_option:
            raise HTTPException(status_code=400, detail="Must provide collapse option")

        result = game.collapse_with_choice(request.collapse_option)
        return result

    except Exception as e:
        logger.error(f"Error collapsing moves: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/game/winner")
def check_winner(session_id: str = Query(...)):
    try:
        game = get_game(session_id)

        win_details = game.get_win_details()
        is_draw = game.check_for_draw()
        winner = win_details['winner']

        return {
            "success": True,
            "winner": winner,
            "is_draw": is_draw,
            "game_over": winner is not None or is_draw,
            "board": game.game_state.board,
            "winning_line": win_details.get('winning_line', []),
            "x_winning_line": win_details.get('x_winning_line'),
            "o_winning_line": win_details.get('o_winning_line'),
            "is_simultaneous": win_details['is_simultaneous'],
            "x_score": win_details['x_score'],
            "o_score": win_details['o_score'],
            "x_wins_count": win_details.get('x_wins_count', 0),
            "o_wins_count": win_details.get('o_wins_count', 0)
        }

    except Exception as e:
        logger.error(f"Error checking winner: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/game/entanglements")
def get_entanglements(session_id: str = Query(...)):
    game = get_game(session_id)
    return {
        "success": True,
        "entanglements": [e.to_dict() for e in game.game_state.entanglements],
        "count": len(game.game_state.entanglements)
    }


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")