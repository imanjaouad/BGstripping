import React from 'react';
import './MainContent.css';

function MainContent() {
  return (
    <main className="main-content">
      <section className="welcome-section">
        <h2>Commencez votre voyage d'apprentissage</h2>
        <p>Explorez nos cours sélectionnés avec soin pour vous</p>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <h3>📚 Cours Variés</h3>
          <p>Des programmes adaptés à tous les niveaux</p>
        </div>
        <div className="feature-card">
          <h3>🎯 Apprentissage Flexible</h3>
          <p>Apprenez à votre rythme, quand vous voulez</p>
        </div>
        <div className="feature-card">
          <h3>🏆 Certifications</h3>
          <p>Obtenez des certifications reconnues</p>
        </div>
      </section>
    </main>
  );
}

export default MainContent;