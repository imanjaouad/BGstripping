import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* --- 1. HEADER (Identique aux autres pages) --- */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
            <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        
        {/* --- 2. TITRE & INTRODUCTION --- */}
        <div style={{textAlign: 'center', marginTop: '20px', marginBottom: '50px', animation: 'fadeIn 0.8s'}}>
          <h2 className="title" style={{marginBottom: '10px'}}>
            Bienvenue sur Etudia
          </h2>
          <div className="underline1" style={{width: '100px', height: '4px', margin: '0 auto 20px auto'}}></div>
          
          <p style={{fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto'}}>
            La plateforme centralisée pour votre réussite académique.
            Accédez à vos ressources en quelques clics.
          </p>
        </div>

        {/* --- 3. PRÉSENTATION SOUS FORME DE CARTES (Même style que les modules) --- */}
        {/* On utilise "modules-grid" pour avoir le même alignement */}
        <div className="modules-grid" style={{animation: 'slideUp 0.6s ease-out'}}>
          
          {/* Carte 1 : Modules */}
          <div className="module-card" style={{cursor: 'default', transform: 'none', borderTop: '4px solid #007bff'}}>
            <div className="module-header">
              <h3>📂 Modules</h3>
              <span className="module-code">Organisé</span>
            </div>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Accédez à la liste complète de vos modules classés par année et filière.
            </p>
            <div style={{fontSize: '40px', textAlign: 'right', opacity: 0.2}}>📚</div>
          </div>

          {/* Carte 2 : Ressources */}
          <div className="module-card" style={{cursor: 'default', transform: 'none', borderTop: '4px solid #28a745'}}>
            <div className="module-header">
              <h3>📄 Cours & TP</h3>
              <span className="module-code" style={{color: '#28a745', background: '#e6fffa'}}>PDF</span>
            </div>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Téléchargez les supports de cours, les travaux pratiques et les exercices.
            </p>
            <div style={{fontSize: '40px', textAlign: 'right', opacity: 0.2}}>📥</div>
          </div>

          {/* Carte 3 : Examens */}
          <div className="module-card" style={{cursor: 'default', transform: 'none', borderTop: '4px solid #ffc107'}}>
            <div className="module-header">
              <h3>🎓 Examens</h3>
              <span className="module-code" style={{color: '#d39e00', background: '#fff3cd'}}>CC / EFM</span>
            </div>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Préparez-vous efficacement avec les archives des contrôles et EFM/EFF.
            </p>
            <div style={{fontSize: '40px', textAlign: 'right', opacity: 0.2}}>🏆</div>
          </div>

        </div>

        {/* --- 4. BOUTON D'ACTION PRINCIPAL --- */}
        <div style={{textAlign: 'center', marginTop: '60px', marginBottom: '40px', animation: 'fadeIn 1s'}}>
          <button 
            className="start-button" 
            onClick={() => navigate('/selection')}
            style={{
                padding: '20px 60px', 
                fontSize: '1.3rem', 
                boxShadow: '0 10px 30px rgba(0, 123, 255, 0.4)'
            }}
          >
            Commencer maintenant 🚀
          </button>
          <p style={{marginTop: '15px', fontSize: '0.9rem', color: '#999'}}>
            Aucune inscription requise.
          </p>
        </div>

      </div>

      {/* --- 5. DÉCORATION (Triangles) --- */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

export default EtudiaLanding;