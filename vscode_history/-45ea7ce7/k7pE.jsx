// src/components/EtudiaLanding.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaLanding() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/selection");
  };

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="main-content">
        <div className="landing-hero">
          {/* Colonne gauche : texte + CTA */}
          <div className="landing-left">
            <span className="tag">Plateforme étudiante</span>
            <h1 className="landing-title">
              Organise tes cours, modules et examens au même endroit.
            </h1>
            <p className="landing-subtitle">
              Etudia centralise tout ton parcours : années, filières, modules,
              supports de cours, contrôles continus, EFM et EFF. Tu choisis ton
              niveau, et on t’affiche exactement ce dont tu as besoin.
            </p>

            <div className="landing-actions">
              <button className="continue-button" onClick={handleStart}>
                Commencer maintenant
              </button>
              <p className="landing-note">
                Pas d’inscription compliquée : sélectionne simplement ton année
                et ta filière pour accéder à tes ressources.
              </p>
            </div>

            <div className="landing-stats">
              <div className="stat-chip">
                <span className="stat-number">📚</span>
                <span className="stat-label">Modules et cours organisés</span>
              </div>
              <div className="stat-chip">
                <span className="stat-number">📝</span>
                <span className="stat-label">CC & EFM regroupés par module</span>
              </div>
              <div className="stat-chip">
                <span className="stat-number">🎓</span>
                <span className="stat-label">EFF accessibles par filière</span>
              </div>
            </div>
          </div>

          {/* Colonne droite : étapes / features */}
          <div className="landing-right">
            <div className="feature-card">
              <h3>1. Choisis ton année</h3>
              <p>
                1ère, 2ème ou 3ème année : sélectionne ton niveau actuel de
                formation.
              </p>
            </div>
            <div className="feature-card">
              <h3>2. Sélectionne ta filière</h3>
              <p>
                Technicien ou Technicien Spécialisé : Etudia te propose les
                modules associés.
              </p>
            </div>
            <div className="feature-card">
              <h3>3. Accède à tes ressources</h3>
              <p>
                Découvre tes cours, CC, EFM et EFF, classés par module pour
                réviser plus efficacement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Décor bas de page */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}