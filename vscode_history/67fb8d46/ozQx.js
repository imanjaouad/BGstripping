import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <Route path="/selection" element={<EtudiaSelectionWrapper />} />

        {/* Modules */}
        <Route path="/modules" element={<EtudiaModulesWrapper />} />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Composant intermédiaire pour gérer la navigation vers les modules
function EtudiaSelectionWrapper() {
  const handleContinue = (selection) => {
    // On passe les données via l'état du navigateur (navigate avec state)
    window.location.href = `/modules?year=${selection.year.id}&filiere=${selection.filiere.id}`;
    // Ou mieux : utiliser useNavigate + state (voir version avancée plus bas)
  };

  return <EtudiaSelection onContinue={handleContinue} />;
}

// Composant qui récupère les paramètres et charge les modules
function EtudiaModulesWrapper() {
  const params = new URLSearchParams(window.location.search);
  const yearId = params.get('year');
  const filiereId = params.get('filiere');

  if (!yearId || !filiereId) {
    return <Navigate to="/selection" />;
  }

  return <EtudiaModules selection={{ year_id: filiereId }} />;
}

export default App;