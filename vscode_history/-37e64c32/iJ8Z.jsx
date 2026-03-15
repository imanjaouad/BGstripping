import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaLanding() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        <h2 className="title">Bienvenue sur Etudia</h2>
        <p>Découvrez vos modules et vos cours facilement.</p>

        <button
          className="start-button"
          onClick={() => navigate("/selection")}
        >
          Commencer
        </button>
      </div>
    </div>
  );
}
