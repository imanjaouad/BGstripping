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

      {/* --- 2. CONTENU CENTRÉ --- */}
      <div className="main-content" style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh' // Centre verticalement
      }}>
        
        {/* Boîte de bienvenue (Style similaire aux cartes modules) */}
        <div className="welcome-box" style={{
            maxWidth: '600px', 
            padding: '40px', 
            animation: 'slideUp 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}>
          
          <h1 className="title" style={{fontSize: '2.5rem', margin: '0 0 10px 0'}}>
            Bienvenue,
          </h1>
          
          <h2 style={{color: '#555', marginTop: '0', fontWeight: '400'}}>
            Cher Apprenant 🎓
          </h2>

          {/* Petite barre décorative */}
          <div className="underline2" style={{margin: '20px auto', width: '50px', height: '4px'}}></div>

          <p style={{fontSize: '1.1rem', color: '#666', lineHeight: '1.8', margin: '30px 0'}}>
            Nous sommes ravis de vous accueillir sur notre plateforme. <br/>
            Ici, vous pourrez explorer vos modules, suivre vos cours et préparer vos examens facilement.
          </p>

          <button 
            className="start-button" 
            onClick={() => navigate('/selection')}
            style={{
                marginTop: '10px',
                padding: '15px 50px',
                fontSize: '1.2rem'
            }}
          >
            Commencer
          </button>

        </div>
      </div>

      {/* --- 3. DÉCORATION (Triangles) --- */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

export default EtudiaLanding;