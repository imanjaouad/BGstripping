import React from 'react';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';


function EtudiaLanding() {
  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
            <img src={logo} alt="" />
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
          <button 
            className="start-button" 
            onClick={() => alert("C'est parti !")}
          >
            Commencer
          </button>
        </div>

      </div>

      {/* Triangles en bas */}
      <div className="triangles-container">
        <div className="triangle small"></div>
        <div className="triangle"></div>
        <div className="triangle small"></div>
        <div className="triangle"></div>
        <div className="triangle small"></div>
        <div className="triangle"></div>
        <div className="triangle small"></div>
        <div className="triangle"></div>
        <div className="triangle small"></div>
        <div className="triangle"></div>
        <div className="triangle"></div>
        <div className="triangle"></div>
      </div>
    </div>
  );
}

export default EtudiaLanding;
