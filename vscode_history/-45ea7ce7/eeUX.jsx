
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

  // Style pour le soulignement spécifique (du début à la fin du mot)
  const underlineStyle = {
    display: 'inline-block',
    borderBottom: '5px solid #007bff', // L'épaisseur de la ligne
    paddingBottom: '2px', // Espace entre le texte et la ligne
    marginBottom: '5px'
  };

  return (
    <div className="container">
      {/* --- HEADER --- */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
            <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="main-content" style={{
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '55vh', 
        textAlign: 'center'
      }}>
        
        <div className="text-section" style={{animation: 'fadeIn 0.8s ease-out'}}>
          
          {/* TITRE : BIENVENUE (Souligné du B au e) */}
          <h1 style={{
            fontSize: '3.5rem', 
            color: '#007bff', 
            margin: '0 0 10px 0',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            <span style={underlineStyle}>Bienvenue</span>,
          </h1>
          
          {/* TITRE : CHER APPRENANT (Souligné du C au t) */}
          <h2 style={{
            fontSize: '2rem', 
            color: '#333', 
            margin: '0 0 30px 0',
            fontWeight: '300'
          }}>
            <span style={underlineStyle}>Cher Apprenant</span>
            <span style={{color: '#007bff'}}> !</span>
          </h2>

          <p style={{
            fontSize: '1.2rem', 
            color: '#666', 
            maxWidth: '500px', 
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Nous sommes ravis de vous accueillir sur notre plateforme. 
            Ici, vous pourrez explorer vos modules, suivre vos cours et préparer vos examens facilement.
          </p>

          <button 
            className="start-button" 
            onClick={() => navigate('/selection')}
            style={{
              padding: '18px 60px',
              fontSize: '1.2rem',
              boxShadow: '0 10px 25px rgba(0, 123, 255, 0.3)'
            }}
          >
            Commencer
          </button>
        </div>

      </div>

      {/* --- DÉCORATION (CADRE COMPLET) --- */}
      <div className="decoration-frame">
        {/* HAUT */}
        <div className="edge top">
          {[...Array(30)].map((_, i) => <div key={`t-${i}`} className="triangle"></div>)}
        </div>

        {/* BAS */}
        <div className="edge bottom">
          {[...Array(30)].map((_, i) => <div key={`b-${i}`} className="triangle"></div>)}
        </div>

        {/* GAUCHE */}
        <div className="edge left">
          {[...Array(15)].map((_, i) => <div key={`l-${i}`} className="triangle"></div>)}
        </div>

        {/* DROITE */}
        <div className="edge right">
          {[...Array(15)].map((_, i) => <div key={`r-${i}`} className="triangle"></div>)}
        </div>
      </div>

    </div> 
  );
}

export default EtudiaLanding;