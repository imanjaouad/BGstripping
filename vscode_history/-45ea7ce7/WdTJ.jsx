// src/components/EtudiaLanding.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaLanding() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* HEADER HERO */}
      <header className="landing-header">
        <div className="logo-container">
          <img src={logo} alt="Etudia" />
        </div>
        <div className="hero-content">
          <h1>
            Bienvenue,<br />
            <span className="highlight">Cher Apprenant</span>
          </h1>
          <p className="hero-subtitle">
            Ta plateforme tout-en-un pour organiser tes cours, réviser tes CC,
            préparer tes EFM et réussir tes EFF.
          </p>
          <button className="cta-button" onClick={() => navigate("/selection")}>
            Commencer maintenant
            <span className="arrow">→</span>
          </button>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="landing-main">
        <section className="features">
          <div className="feature-card">
            <div className="icon">📚</div>
            <h3>Tous tes modules au même endroit</h3>
            <p>1ère, 2ème ou 3ème année — Technicien ou Spécialisé</p>
          </div>
          <div className="feature-card">
            <div className="icon">📝</div>
            <h3>Cours, CC & EFM par module</h3>
            <p>Télécharge tout en un clic, révisé efficacement</p>
          </div>
          <div className="feature-card">
            <div className="icon">🎓</div>
            <h3>Examens de Fin de Formation (EFF)</h3>
            <p>Sujets officiels disponibles par filière</p>
          </div>
        </section>

        <div className="final-cta">
          <p>Prêt à booster ta réussite ?</p>
          <button className="cta-button large" onClick={() => navigate("/selection")}>
            Accéder à mon espace étudiant
          </button>
        </div>
      </main>

      {/* DÉCOR MONTAGNES + FORÊT + MER (en bas) */}
      <div className="mountain-scene">
        <div className="mountains">
          <div className="mountain peak"></div>
          <div className="mountain"></div>
          <div className="mountain mid"></div>
          <div className="mountain"></div>
          <div className="mountain far"></div>
        </div>
        <div className="forest"></div>
        <div className="sea"></div>
      </div>
    </div>
  );
}