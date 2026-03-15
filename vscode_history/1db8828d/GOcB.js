// src/components/LevelSelector.js
import React from 'react';
import styles from '/level_selector.js';

// Data pour les boutons Année
const annees = [
  { label: '1er Année', isActive: false, className: styles.buttonAnnee },
  { label: '2eme Année', isActive: true, className: styles.buttonActive }, // Bouton actif
  { label: '3eme Année', isActive: false, className: styles.buttonAnnee },
];

// Data pour les boutons Niveau
const niveaux = [
  { label: 'Technicien spécialisé', isActive: true, className: styles.buttonSpecialiseActive }, // Bouton actif
  { label: 'Tecnicien', isActive: false, className: styles.buttonNiveau },
];

const LevelSelector = () => {
  return (
    <>
      {/* --- Section Année --- */}
      <div className={styles.titleContainer}>
        <h2 className={styles.titleText}>
          <span className={styles.underline}>Tu es dans :</span>
        </h2>
      </div>
      
      <div className={styles.buttonGroup}>
        {annees.map((annee, index) => (
          <button 
            key={index} 
            className={`${styles.selectionButton} ${annee.className}`}
            // Vous pouvez ajouter un onClick ici pour la logique de sélection
          >
            {annee.label}
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
        {niveaux.map((niveau, index) => (
          <button 
            key={index} 
            className={`${styles.selectionButton} ${niveau.className}`}
            // Vous pouvez ajouter un onClick ici pour la logique de sélection
          >
            {niveau.label}
          </button>
        ))}
      </div>
    </>
  );
};

export default LevelSelector;