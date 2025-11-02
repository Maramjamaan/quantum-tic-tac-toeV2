import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import QuantumTicTacToe from './components/QuantumTicTacToe';
import './components/QuantumTicTacToe.css';

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <QuantumTicTacToe />
      </div>
    </LanguageProvider>
  );
}

export default App;