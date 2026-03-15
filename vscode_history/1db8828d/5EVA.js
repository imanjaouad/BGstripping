// src/components/LevelSelector.js
import React, { useState } from 'react';
// ATTENTION: Le chemin d'importation de style doit être corrigé
// Il devrait être un chemin relatif vers le fichier .module.css
import styles from './level_selector'; 

// Data de base pour les boutons Année
const initialAnnees = [
  '1er Année',
  '2eme Année', // Celui-ci est l'actif initial (index 1)
  '3eme Année',
];

// Data de base pour les boutons Niveau
const initialNiveaux = [
  'Technicien spécialisé', // Celui-ci est l'actif initial (index 0)
  'Tecnicien',
];

const LevelSelector = () => {
  // État pour suivre l'année sélectionnée (label ou index)
  const [selectedAnnee, setSelectedAnnee] = useState(initialAnnees[1]);
  // État pour suivre le niveau sélectionné (label ou index)
  const [selectedNiveau, setSelectedNiveau] = useState(initialNiveaux[0]);

  // Fonction pour déterminer la classe CSS d'un bouton Année
  const getAnneeButtonClass = (anneeLabel) => {
    // Si l'année est sélectionnée
    if (anneeLabel === selectedAnnee) {
      return styles.buttonActive;
    }
    // Sinon, c'est la classe par défaut
    return styles.buttonAnnee;
  };

  // Fonction pour déterminer la classe CSS d'un bouton Niveau
  const getNiveauButtonClass = (niveauLabel) => {
    // Si le niveau est sélectionné
    if (niveauLabel === selectedNiveau) {
      return styles.buttonSpecialiseActive;
    }
    // Sinon, c'est la classe par défaut
    return styles.buttonNiveau;
  };

  return (
    <>
      {/* --- Section Année --- */}
      <div className={styles.titleContainer}>
        <h2 className={styles.titleText}>
          <span className={styles.underline}>Tu es dans :</span>
        </h2>
      </div>
      
      <div className={styles.buttonGroup}>
        {initialAnnees.map((anneeLabel, index) => (
          <button 
            key={index} 
            className={`${styles.selectionButton} ${getAnneeButtonClass(anneeLabel)}`}
            onClick={() => setSelectedAnnee(anneeLabel)} // Logique de sélection
          >
            {anneeLabel}
          </button>
        ))}
      </div>

      {/* --- Section Niveau --- */}
      <div className={styles.titleContainer}>
        <h2 className={styles.titleText}>
          <span className={styles.underline}>Niveau :</span>
        </h2>
      </div>

      <div className={styles.buttonGroup}>
        {initialNiveaux.map((niveauLabel, index) => (
          <button 
            key={index} 
            className={`${styles.selectionButton} ${getNiveauButtonClass(niveauLabel)}`}
            onClick={() => setSelectedNiveau(niveauLabel)} // Logique de sélection
          >
            {niveauLabel}
          </button>
        ))}
      </div>
      
      {/* Affichage de l'état pour débogage (optionnel) */}
      <p style={{marginTop: '30px', fontSize: '0.9rem', color: '#555', zIndex: 1}}>
        Sélection actuelle: **{selectedAnnee}** en **{selectedNiveau}**
      </p>
    </>
  );
};

export default LevelSelector;