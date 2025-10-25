# ⚛️ Quantum Tic-Tac-Toe

A quantum computing educational tool that brings quantum mechanics concepts to life through an interactive game.

![Game Screenshot](screenshot.png) <!-- Add a screenshot later -->

## 🎓 About

This graduation project implements **Quantum Tic-Tac-Toe** based on Allan Goff's research paper, demonstrating real quantum computing concepts:
- **Superposition**: Moves exist in multiple positions simultaneously
- **Entanglement**: Connected quantum states
- **Measurement/Collapse**: Quantum states resolving to classical positions

**Educational Purpose**: Help students understand quantum mechanics through interactive gameplay.

## ✨ Features

### Quantum Mechanics Implementation
- ✅ Real quantum circuits using IBM's Qiskit framework
- ✅ Hadamard gates for superposition
- ✅ Quantum measurement and collapse
- ✅ Entanglement detection and visualization

### Game Features
- 🎮 Interactive web-based interface
- 🌀 Visual quantum state representation
- 🔄 Player-controlled collapse mechanism
- 📊 Real-time game statistics
- 🏆 Winner detection and draw handling

## 🛠️ Tech Stack

**Frontend:**
- React.js 19.1.1
- Custom CSS with responsive design
- Modern React Hooks

**Backend:**
- Python 3.8+
- FastAPI for REST API
- Qiskit 0.45.0 (IBM Quantum Framework)
- Qiskit Aer Simulator

## 📋 Prerequisites

Before running this project, ensure you have:

```bash
# Check Node.js version (should be 14+)
node --version

# Check Python version (should be 3.8+)
python --version

# Check npm
npm --version
```

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Maramjamaan/quantum-tic-tac-toeV2.git
cd quantum-tic-tac-toeV2
```

### 2️⃣ Install Frontend Dependencies

```bash
npm install
```

### 3️⃣ Install Backend Dependencies

```bash
cd python
pip install -r requirements.txt
cd ..
```

## ▶️ Running the Application

You need **TWO terminals** running simultaneously:

### Terminal 1: Start Backend (Python API)

```bash
cd python
python api.py
```

✅ Backend will run on: `http://localhost:8000`  
✅ API docs available at: `http://localhost:8000/docs`

### Terminal 2: Start Frontend (React App)

```bash
npm start
```

✅ Frontend will run on: `http://localhost:3000`  
✅ Browser will open automatically

## 🎮 How to Play

### Basic Gameplay

1. **Make Quantum Moves**: Click 2 squares to place your mark in both simultaneously
2. **Create Entanglements**: When moves share squares, they become entangled
3. **Trigger Collapse**: When entanglements form a cycle, choose how to collapse
4. **Win the Game**: Get 3 classical (collapsed) marks in a row

### Game Rules

- Each player places quantum moves in **2 squares** at once
- Moves sharing squares become **entangled**
- Cycles in the entanglement graph trigger **collapse**
- The player who creates a cycle gives their opponent **control of the collapse**
- Only **classical marks** (after collapse) count for winning
- Game ends in a **draw** if less than 2 squares remain available

## 📚 Quantum Concepts Explained

### Superposition (التراكب الكمي)
Your move exists in **two squares simultaneously** until measured. Just like Schrödinger's cat being both alive and dead until observed.

**In the game**: When you select squares 0 and 4, your mark `X1` is in both positions at once.

### Entanglement (التشابك الكمي)
When two quantum moves share a square, they become **connected**. Measuring one affects the other.

**In the game**: If `X1` is in [0,4] and `O1` is in [4,8], they're entangled at square 4.

### Collapse (الانهيار الكمي)
Quantum states resolve to definite classical positions.

**In the game**: When a cycle forms, you choose where each move collapses to.

### Cyclic Entanglement (التشابك الدائري)
When entanglements form a closed loop, forcing collapse.

**In the game**: X1→O1→X2→X1 creates a cycle, triggering collapse.

## 🏗️ Project Structure

```
quantum-tic-tac-toe/
├── python/                    # Backend
│   ├── api.py                # FastAPI REST API
│   ├── quantum_game.py       # Game engine with Qiskit
│   └── requirements.txt      # Python dependencies
├── src/                      # Frontend
│   ├── components/           # React components
│   ├── hooks/               # Custom hooks (useGameState, useQuantumAPI)
│   └── types/               # TypeScript-like type definitions
├── public/                   # Static assets
└── README.md                # This file
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/game/new` | Start new game |
| GET | `/game/state` | Get current state |
| POST | `/game/move` | Make quantum move |
| POST | `/game/collapse` | Collapse quantum states |
| GET | `/game/winner` | Check for winner |

**Full API documentation**: `http://localhost:8000/docs`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Game starts with Player X
- [ ] Can select 2 squares for quantum moves
- [ ] Quantum moves appear in both squares
- [ ] Entanglement detected when squares shared
- [ ] Cycle detection works
- [ ] Collapse options appear
- [ ] Winner detection works (3 in a row)
- [ ] Draw detection works (board full)
- [ ] Draw detection works (< 2 squares available)
- [ ] Reset game works

### Run Backend Tests

```bash
cd python
python quantum_game.py
```

Expected output: Test scenarios with cycle detection and collapse.

## 🐛 Troubleshooting

### Backend won't start
```bash
# Reinstall dependencies
cd python
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
Make sure backend is running on `http://localhost:8000`

### Port Already in Use
```bash
# Kill process on port 8000 (Backend)
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8000 | xargs kill -9
```

## 📖 References

- **Allan Goff's Paper**: Original Quantum Tic-Tac-Toe research
- **Qiskit Documentation**: https://qiskit.org/documentation/
- **FastAPI Documentation**: https://fastapi.tiangolo.com/

## 👩‍💻 Author

**Maram**  
Information Technology Student  
Graduation Project - 2025

## 🙏 Acknowledgments

- Based on Allan Goff's Quantum Tic-Tac-Toe paper
- Built with IBM's Qiskit quantum computing framework
- Created as an educational tool to teach quantum mechanics concepts

## 📝 License

This project is for educational purposes as part of a graduation project.

---

## 🎯 Future Enhancements

- [ ] Arabic language version
- [ ] Tutorial mode with step-by-step guidance
- [ ] Real IBM Quantum Computer integration (currently using simulator)
- [ ] Mobile responsive design improvements
- [ ] Multiplayer online mode

---

**Made with ❤️ for quantum computing education**
