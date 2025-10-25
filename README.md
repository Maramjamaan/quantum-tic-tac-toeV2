# Quantum Tic-Tac-Toe

A quantum twist on the classic game, implementing real quantum computing concepts using React and Python with Qiskit.

## Overview

This project implements Allan Goff's Quantum Tic-Tac-Toe, where players can place moves in quantum superposition across multiple squares simultaneously. When quantum entanglements form cycles, the quantum states collapse to classical positions, adding a strategic layer beyond traditional tic-tac-toe.

## Features

- **Quantum Superposition**: Each move exists in two squares simultaneously
- **Quantum Entanglement**: Moves sharing squares become entangled
- **Cycle Detection**: Automatic detection when entanglements form closed loops
- **Quantum Collapse**: Player-controlled collapse of quantum states to classical positions
- **Real Quantum Simulation**: Backend uses Qiskit for authentic quantum computing

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Python FastAPI with Qiskit quantum computing framework
- **Styling**: Custom CSS with responsive design
- **State Management**: React hooks with API integration

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quantum-tic-tac-toe.git
cd quantum-tic-tac-toe
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd python
pip install -r requirements.txt
cd ..
```

## Running the Application

1. Start the Python backend:
```bash
cd python
python api.py
```
The backend will run on http://localhost:8000

2. Start the React frontend (in a new terminal):
```bash
npm start
```
The frontend will run on http://localhost:3000

## How to Play

1. **Make Quantum Moves**: Select 2 squares for each move (your mark exists in both simultaneously)
2. **Create Entanglements**: When moves share squares, they become entangled
3. **Trigger Collapse**: When entanglements form a cycle, the player who didn't create it chooses how to collapse
4. **Win**: Get 3 classical (collapsed) marks in a row to win

## Game Rules

- Each player places quantum moves in 2 squares at once
- Moves sharing squares become entangled
- Cycles in the entanglement graph trigger collapse
- The player who creates a cycle gives their opponent control of the collapse
- Only classical marks (after collapse) count for winning

## Project Structure
```
quantum-tic-tac-toe/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   └── types/          # Type definitions
├── python/
│   ├── quantum_game.py # Quantum game logic
│   └── api.py          # FastAPI backend
└── public/             # Static assets
```

## API Endpoints

- `POST /game/new` - Start a new game
- `GET /game/state` - Get current game state
- `POST /game/move` - Make a quantum move
- `POST /game/collapse` - Collapse quantum states
- `GET /game/winner` - Check for winner

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Based on Allan Goff's paper on Quantum Tic-Tac-Toe
- Uses IBM's Qiskit framework for quantum computing simulation
- Created as a graduation project demonstrating quantum computing concepts
