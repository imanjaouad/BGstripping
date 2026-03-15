// src/components/LogoSection.js
import React from 'react';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: '15vh', // Positionne la section plus bas
  position: 'relative',
  zIndex: 1, // Assure que le contenu est au-dessus des graphismes
  width: '100%',
  boxSizing: 'border-box',
};

// Styles pour le logo
const logoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20vh', // Grande marge pour positionner le texte de bienvenue
  // Ajuster la marge pour respecter l'alignement vertical de l'image.
};

const graduationCapStyle = {
  fontSize: '5rem', // Taille du chapeau de diplômé
  color: '#0070e0',
  lineHeight: 1,
  // Le symbole '🎓' est utilisé ici pour simuler l'icône
};

const logoTextStyle = {
  fontFamily: 'Georgia, serif',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
  marginTop: '-0.5rem',
};

const sloganStyle = {
  fontFamily: 'cursive',
  fontSize: '0.8rem',
  color: '#555',
  borderBottom: '1px solid #555',
  paddingBottom: '0.1rem',
};

// Styles pour le texte de bienvenue
const textStyle = {
  fontFamily: 'sans-serif',
  fontSize: '2.5rem',
  fontWeight: 600,
  color: '#333',
  lineHeight: 1.2,
  alignSelf: 'flex-start',
  marginLeft: '10vw', // Marge gauche pour l'alignement
};

const underlineStyle = {
  borderBottom: '3px solid #0070e0', // La ligne bleue
  display: 'inline-block',
  paddingBottom: '0.2rem',
};

const LogoSection = () => (
  <div style={containerStyle}>
    <div style={logoStyle}>
      {/* Simulation du logo Etudia */}
      <span role="img" aria-label="Graduation cap" style={graduationCapStyle}>
        🎓
      </span>
      <div style={logoTextStyle}>Etudia</div>
      <div style={sloganStyle}>Learn more</div>
    </div>

    {/* Texte de bienvenue */}
    <h1 style={{ ...textStyle, marginBottom: '2vh' }}>
      <span style={underlineStyle}>Bienvenue,</span>
    </h1>
    <h1 style={textStyle}>
      <span style={underlineStyle}>Cher Apprenant,</span>
    </h1>
  </div>
);

export default LogoSection;