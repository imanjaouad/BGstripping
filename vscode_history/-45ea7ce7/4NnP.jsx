import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

  // Style réutilisable pour le soulignement
  const underlineStyle = {
    display: 'inline-block', // Permet au span de respecter le padding
    borderBottom: '4px solid #007bff', // La ligne bleue
    paddingBottom: '5px', // Espace entre le texte et la ligne
    marginBottom: '20px' // Espace sous la ligne
  };

  return (
    <div className="container">
      {/* --- HEADER --- */}
      <div className="header">
        {/* On garde ta logique de header existante ou celle que je t'ai donnée avant */}
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
          
          {/* TITRE BIENVENUE */}
          <h1 style={{
            fontSize: '3.5rem', 
            color: '#007bff', 
            margin: '0',
            fontWeight: '700',
            lineHeight: '1.2'
          }}>
            {/* On applique le style uniquement sur "Bienvenue" pour aller du B au e */}
            <span style={underlineStyle}>Bienvenue</span>,
          </h1>

          {/* TITRE CHER APPRENANT */}
          <h2 style={{
            fontSize: '2rem', 
            color: '#333', 
            margin: '10px 0 30px 0',
            fontWeight: '300'
          }}>
            {/* On applique le style sur "Cher Apprenant" pour aller du C au t */}
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

      {/* --- DÉCORATION --- */}
      <div className="triangles-container">
        {[...Array(25)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div> 
  );
}

export default EtudiaLanding;