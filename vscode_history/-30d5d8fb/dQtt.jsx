import React, { useState } from 'react';
import '../App.css';

export default function EtudiaModules() {
  const [moduleSelectionne, setModuleSelectionne] = useState(null);

  const modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4'];

  const handleModuleClick = (module) => {
    setModuleSelectionne(module);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="diagonal"></div>
        
        <div className="logo-container">
          <div className="logo-box">
            <span className="logo-icon">🎓</span>
          </div>
          <h1 className="logo-text">Etudia</h1>
          <p className="logo-subtitle">Learn more</p>
        </div>
        <div className="wave"></div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Section Modules */}
        <div className="section">
          <h2 className="section-title">Listes des modules :</h2>
          <div className="section-underline"></div>
          <div className="button-group">
            {modules.map((module) => (
              <button
                key={module}
                className={`button ${moduleSelectionne === module ? 'active' : ''}`}
                onClick={() => handleModuleClick(module)}
              >
                {module}
              </button>
            ))}
          </div>
        </div>

        {/* Info et bouton continuer */}
        {moduleSelectionne && (
          <div className="info-box">
            <p>Sélectionné: {moduleSelectionne}</p>
            <button 
              className="continue-button" 
              onClick={() => alert(`Vous avez choisi: ${moduleSelectionne}`)}
            >
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}