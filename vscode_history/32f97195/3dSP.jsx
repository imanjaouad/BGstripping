import React from 'react';
import '../App.css';

export default function EtudiaLanding() {
  return (
    <div className="container">
      {/* Header avec fond bleu */}
      <div className="header">
        {/* Diagonale en haut à droite */}
        <div className="diagonal"></div>
        
        {/* Logo et titre */}
        <div className="logo-container">
          <div className="logo-box">
            <span className="logo-icon">🎓</span>
          </div>
          <h1 className="logo-text">Etudia</h1>
          <p className="logo-subtitle">Learn more</p>
        </div>
      </div>

      {/* Container principal */}
      <div className="main-content">
        {/* Texte principal */}
        <div className="text-section">
          <h2 className="title">
            Bienvenue,
            <div className="underline"></div>
          </h2>
          
          <h3 className="title">
            Cher<br />
            Apprenant,
            <div className="underline"></div>
          </h3>
        </div>
      </div>

      {/* Triangles décorativement en haut */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}