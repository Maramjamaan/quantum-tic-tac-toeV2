# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



File Descriptions
🧩 Components

GameBoard: Main 3x3 game grid component
GameSquare: Individual square with quantum/classical state display
ControlPanel: Game mode switches and controls
MoveHistory: Display of all moves and entanglements
CollapseModal: Interface for choosing collapse outcomes
RulesPanel: Game rules and help information

🔧 Hooks

useGameState: Main game state management
useQuantumLogic: Quantum mechanics logic and calculations
useQiskit: Integration with Qiskit quantum backend

🛠️ Utils

gameLogic: Core game rules and validation
quantumMechanics: Quantum superposition and measurement
entanglementDetector: Detect when moves become entangled
cycleDetector: Find cyclic entanglements in the game graph
collapseEngine: Handle quantum state collapse

🌐 Services

qiskitService: Interface to Python Qiskit backend
quantumBackend: Quantum circuit creation and execution

📝 Types & Constants

gameTypes: TypeScript-style type definitions
gameConstants: Game configuration and constants

🐍 Python Backend

quantum_game: Main quantum game logic
superposition: Quantum superposition implementation
measurement: Quantum measurement and collapse
entanglement_simulator: Quantum entanglement simulation
quantum_api: FastAPI backend for React integration

🚀 Development Flow

Phase 1: Basic React components and UI
Phase 2: Game logic and state management
Phase 3: Quantum mechanics simulation
Phase 4: Qiskit integration
Phase 5: Advanced features and optimization

📚 Documentation Strategy
Each file will include:

Purpose: What this file does
Dependencies: What it requires
Exports: What it provides
Usage Examples: How to use it
Quantum Concepts: Related quantum mechanics principles