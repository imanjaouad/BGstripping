import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtudiaLanding from './pages/EtudiaLanding';
import EtudiaSelection from './pages/EtudiaSelection';
import EtudiaModules from './pages/EtudiaModules';

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
          element={<EtudiaModules selection={selection} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
