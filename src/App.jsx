import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import QuantumComputing from './Pages/QuantumComputing/QuantumComputing';

// Pages
import HomePage from './Pages/HomePage/HomePage';
import QuantumTicTacToe from './components/QuantumTicTacToe';
// import QuantumComputing from './Pages/QuantumComputing/QuantumComputing';  // لاحقاً
// import HowToPlay from './Pages/HowToPlay/HowToPlay';  // لاحقاً

import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Home Page - الصفحة الرئيسية */}
            <Route path="/" element={<HomePage />} />
            
            {/* Game Page - صفحة اللعبة */}
            <Route path="/game" element={<QuantumTicTacToe />} />
            
            {/* Quantum Computing Page - صفحة شرح الكوانتم */}
            <Route path="/quantum-computing" element={<QuantumComputing />} />
            
            {/* How to Play Page - صفحة كيف تلعب (لاحقاً) */}
            {/* <Route path="/how-to-play" element={<HowToPlay />} /> */}
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;