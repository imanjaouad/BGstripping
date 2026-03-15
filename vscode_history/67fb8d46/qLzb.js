// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EtudiaLanding from './components/EtudiaLanding';
import EtudiaSelection from './components/EtudiaSelection';
import EtudiaModules from './components/EtudiaModules';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EtudiaLanding />} />
      <Route path="/selection" element={<EtudiaSelection />} />
      <Route path="/modules" element={<EtudiaModules />} />
      <Route path="*" element={<EtudiaLanding />} />
    </Routes>
  );
}

export default App;