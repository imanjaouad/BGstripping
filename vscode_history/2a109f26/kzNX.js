// src/components/FooterGraphics.js
import React from 'react';

const footerStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '20vh', // Estimation de la hauteur pour la zone inférieure
  overflow: 'hidden',
  zIndex: 0,
};

// La forme en 'montagne' bleue
const mountainShapeStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '150%', // Permet de dessiner des pointes qui sortent du conteneur
  backgroundColor: '#0070e0',
  clipPath: 'polygon(0% 100%, 15% 40%, 30% 90%, 45% 30%, 60% 80%, 75% 10%, 90% 100%, 100% 100%)',
  // Ce clip-path simule les pics de montagne vus sur l'image
};

// L'étoile/astérisque
const starStyle = {
  position: 'absolute',
  bottom: '5vh', // Position estimée
  left: '45vw', // Centre l'étoile horizontalement
  fontSize: '2rem',
  color: '#333', // Couleur foncée
  transform: 'rotate(45deg)', // Légère rotation si nécessaire
  zIndex: 1,
};

const FooterGraphics = () => (
  <div style={footerStyle}>
    <div style={mountainShapeStyle}></div>
    <div style={starStyle}>*</div> {/* L'astérisque représente l'étoile */}
  </div>
);

export default FooterGraphics;