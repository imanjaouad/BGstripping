import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtudiaLanding from './components/EtudiaLanding';
import EtudiaSelection from './components/EtudiaSelection';
import EtudiaModules from './components/EtudiaModules';
import EtudiaCC from './components/EtudiaCC';

function ModulesWrapper({ selection }) {
  const [moduleSelectionne, setModuleSelectionne] = useState(null);

  return (
    <div>
      <EtudiaModules 
        selection={selection} 
        onContinue={setModuleSelectionne} 
      />

      {/* Affiche les EFM et CC seulement si un module est sélectionné */}
      {moduleSelectionne && (
        <div>
          <EtudiaCC moduleSelectionne={moduleSelectionne} />
        </div>
      )}
    </div>
  );
}

function App() {
  const [selection, setSelection] = useState(null); // année + niveau + filiere_id

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EtudiaLanding />} />
        <Route 
          path="/selection" 
          element={<EtudiaSelection onContinue={setSelection} />} 
        />
        <Route 
          path="/modules" 
          element={<ModulesWrapper selection={selection} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
