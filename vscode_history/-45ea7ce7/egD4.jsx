import React from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

export default function EtudiaLanding() {

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="logo" />
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
            Nous sommes ravis de vous accueillir sur notre plateforme.
            Explorez vos modules, suivez vos cours et préparez vos examens facilement.
          </p>

          <br />

          <button
            className="start-button"
            onClick={() => navigate("/selection")}
          >
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
