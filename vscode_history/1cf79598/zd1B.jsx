import React, { useState, useEffect } from 'react';
import '../App.css';
import logo from './images/image_etudia-removebg-preview.png';

export default function EtudiaCC({ moduleSelectionne }) {
  const [ccs, setCcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleSelectionne) return;

    // Récupérer les CC depuis l'API
    fetch(`https://podo.b1.ma/api/public/modules/${moduleSelectionne.id}/ccs`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API CCs');
        return res.json();
      })
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setCcs(json.data);
        } else {
          setError('Aucun CC trouvé pour ce module');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [moduleSelectionne]);

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        {/* Titre */}
        <div className="title-box">
          <h2 className="section-title">Contrôles Continus - {moduleSelectionne?.name}</h2>
          <p className="filiere-info">Professeur: {moduleSelectionne?.instructor}</p>
        </div>

        {loading && <p>Chargement des CC...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && ccs.length === 0 && <p>Aucun contrôle continu disponible.</p>}

        <div className="modules-grid">
          {ccs.map(cc => (
            <div key={cc.id} className="module-card">
              <h3>{cc.title}</h3>
              {cc.file_path && (
                <a href={cc.file_path} target="_blank" rel="noopener noreferrer" className="efm-link">
                  Télécharger le fichier
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
