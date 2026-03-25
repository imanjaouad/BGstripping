import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/selection');
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        <div className="text-section">
          <h2 className="title">
            Bienvenue,
            <div className="underline1"></div>
          </h2>
          <br />
          <h3 className="title">
            Cher Apprenant,
            <div className="underline2"></div>
          </h3>

          <p>
            Nous sommes ravis de vous accueillir sur notre plateforme. Ici, vous pourrez explorer vos modules, suivre vos cours et préparer vos examens facilement.
          </p>

          <br />
          <button className="start-button" onClick={handleStart}>
            Commencer
          </button>
        </div>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}

export default EtudiaLanding;