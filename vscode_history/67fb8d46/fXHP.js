import React, { useState } from 'react';
import './App.css';
import EtudiaLanding from './components/EtudiaLanding';
import EtudiaSelection from './components/EtudiaSelection';
import EtudiaModules from './components/EtudiaModules';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selection, setSelection] = useState(null);

  const handleStart = () => {
    setCurrentPage('selection');
  };

  const handleSelectionContinue = (selectionData) => {
    setSelection(selectionData);
    setCurrentPage('modules');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <EtudiaLanding onStart={handleStart} />
      )}
      
      {currentPage === 'selection' && (
        <EtudiaSelection onContinue={handleSelectionContinue} />
      )}
      
      {currentPage === 'modules' && (
        <EtudiaModules selection={selection} />
      )}
    </div>
  );
}

export default App;