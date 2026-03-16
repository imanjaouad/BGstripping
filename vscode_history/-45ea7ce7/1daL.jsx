import React from 'react';
import { useNavigate } from "react-router-dom";
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

function EtudiaLanding() {

  const navigate = useNavigate();

  return (
    <div className="container">
      ...
      <button 
        className="start-button" 
        onClick={() => navigate("/selection")}
      >
        Commencer
      </button>
      ...
    </div>
  );
}

export default EtudiaLanding;
