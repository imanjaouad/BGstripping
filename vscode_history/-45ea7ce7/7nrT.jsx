import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        {/* La diagonale est cachée via CSS car le fond est total */}
        <div className="diagonal"></div>
        <div className="logo-container">
            <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="main-content" style={{
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh', // Centre bien au milieu
        textAlign: 'center'
      }}>
        
        <div className="text-section" style={{animation: 'fadeIn 0.8s ease-out'}}>
          
          <h1 style={{
            fontSize: '4rem', 
            color: 'white', // Blanc pur
            margin: '0',
            fontWeight: '700',
            lineHeight: '1.1',
            textShadow: '0 4px 15px rgba(0,0,0,0.2)' // Ombre pour lisibilité
          }}>
            Bienvenue
          </h1>
          
          <h2 style={{
            fontSize: '2rem', 
            color: 'rgba(255, 255, 255, 0.9)', // Blanc légèrement transparent
            margin: '10px 0 30px 0',
            fontWeight: '300'
          }}>
            Cher Apprenant 🎓
          </h2>

          {/* Ligne blanche */}
          <div style={{
            width: '80px', 
            height: '4px', 
            background: 'white', 
            margin: '0 auto 40px auto',
            borderRadius: '2px',
            opacity: 0.8
          }}></div>

          <p style={{
            fontSize: '1.3rem', 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '600px', 
            margin: '0 auto 50px auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Votre espace dédié pour explorer vos modules, suivre vos cours et préparer vos examens.
          </p>

          <button 
            className="start-button" 
            onClick={() => navigate('/selection')}
          >
            Commencer l'aventure
          </button>
        </div>

      </div>

      {/* TRIANGLES (Maintenant blancs grâce au CSS) */}
      <div className="triangles-container">
        {[...Array(30)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

export default EtudiaLanding;