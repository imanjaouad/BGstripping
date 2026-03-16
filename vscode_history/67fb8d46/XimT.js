// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtudiaLanding from './components/EtudiaLanding';
import EtudiaSelection from './components/EtudiaSelection';
import EtudiaModules from './components/EtudiaModules';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<EtudiaLanding />} />
        
        {/* Sélection année + filière */}
        <Route path="/selection" element={<EtudiaSelection />} />
        
        {/* Modules */}
        <Route path="/modules" element={<EtudiaModules />} />
      </Routes>
    </Router>
  );
}

export default App;