import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtudiaLanding from './components/EtudiaLanding';
import EtudiaSelection from './components/EtudiaSelection';
import EtudiaModules from './components/EtudiaModules';


function App() {
  const [selection, setSelection] = useState(null);

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
