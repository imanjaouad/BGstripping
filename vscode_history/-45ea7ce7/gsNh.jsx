import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

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
        minHeight: '55vh', // Centre verticalement
        textAlign: 'center'
      }}>
        
        {/* Section Texte (sans bordure, sans fond) */}
        <div className="text-section" style={{animation: 'fadeIn 0.8s ease-out'}}>
          
          <h1 style={{
            fontSize: '3.5rem', 
            color: '#007bff', 
            margin: '0',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            Bienvenue,
          </h1>
          
          <h2 style={{
            fontSize: '2rem', 
            color: '#333', 
            margin: '10px 0 20px 0',
            fontWeight: '300'
          }}>
            Cher Apprenant <span style={{color: '#007bff'}}>!</span>
          </h2>

          {/* Ligne décorative simple */}
          <div style={{
            width: '60px', 
            height: '4px', 
            background: '#007bff', 
            margin: '0 auto 30px auto',
            borderRadius: '2px'
          }}></div>

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
              boxShadow: '0 10px 25px rgba(0, 123, 255, 0.3)' // Ombre douce pour faire ressortir le bouton
            }}
          >
            Commencer
          </button>
        </div>

      </div>

      {/* --- DÉCORATION --- */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

export default EtudiaLanding;