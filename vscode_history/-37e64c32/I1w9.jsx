import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();
  
  // États des données
  const [years, setYears] = useState([]);
  const [filieres, setFilieres] = useState([]);
  
  // États de sélection
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedFiliere, setSelectedFiliere] = useState(null);
  
  // États de chargement
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [error, setError] = useState(null);

  // Refs pour le scroll automatique
  const filiereSectionRef = useRef(null);
  const continueRef = useRef(null);

  // 1. Charger les années
  useEffect(() => {
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API");
        return res.json();
      })
      .then((data) => {
        setYears(data.data || data || []);
        setLoadingYears(false);
      })
      .catch((err) => {
        setError("Impossible de charger les années.");
        setLoadingYears(false);
      });
  }, []);

  // 2. Charger les filières quand une année est cliquée
  useEffect(() => {
    if (!selectedYear) return;

    setLoadingFilieres(true);
    setFilieres([]); 
    setSelectedFiliere(null); // Reset choix filière

    fetch(`https://podo.b1.ma/api/public/years/${selectedYear.id}/filieres`)
      .then((res) => res.json())
      .then((data) => {
        setFilieres(data.data || data || []);
        setLoadingFilieres(false);
        
        // Scroll doux vers la section filières
        setTimeout(() => {
          filiereSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      })
      .catch((err) => {
        console.error(err);
        setLoadingFilieres(false);
      });
  }, [selectedYear]);

  // 3. Scroll vers le bouton continuer
  useEffect(() => {
    if (selectedFiliere) {
      setTimeout(() => {
        continueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [selectedFiliere]);

  const handleContinue = () => {
    if (selectedYear && selectedFiliere) {
      navigate('/modules', { 
        state: {
          year: selectedYear,
          filiere: selectedFiliere,
          filiere_id: selectedFiliere.id
        }
      });
    }
  };

  return (
    <div className="container">
      {/* --- HEADER (Identique à Modules) --- */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Retour à l'accueil
      </button>

      <div className="main-content">
        
        {/* TITRE PRINCIPAL */}
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h2 className="title" style={{fontSize: '2rem', marginBottom: '10px'}}>Configuration</h2>
          <p style={{color: '#666'}}>Veuillez sélectionner votre parcours.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* --- ÉTAPE 1 : ANNÉES --- */}
        <div className="section">
          <h3 className="section-title">1. Année d'étude</h3>
          
          {loadingYears ? (
            <p className="loading-text">Chargement...</p>
          ) : (
            // On utilise la même classe "modules-grid" pour avoir le même look de grille
            <div className="modules-grid">
              {years.map((year) => (
                <div
                  key={year.id}
                  className="module-card" // On réutilise le style des cartes modules
                  onClick={() => setSelectedYear(year)}
                  style={{
                    // Style conditionnel pour montrer la sélection
                    border: selectedYear?.id === year.id ? '2px solid #007bff' : '1px solid transparent',
                    background: selectedYear?.id === year.id ? '#f0f7ff' : 'white',
                    transform: selectedYear?.id === year.id ? 'translateY(-5px)' : 'none'
                  }}
                >
                  <div className="module-header">
                    <h3 style={{fontSize: '1.3rem'}}>{year.name || year.year_name}</h3>
                    {selectedYear?.id === year.id && <span className="module-code">✓</span>}
                  </div>
                  <p style={{color: '#666'}}>Sélectionner pour voir les filières</p>
                  
                  <button className="select-module-btn" style={{
                    background: selectedYear?.id === year.id ? '#007bff' : '#f8f9fa',
                    color: selectedYear?.id === year.id ? 'white' : '#007bff'
                  }}>
                    {selectedYear?.id === year.id ? 'Année Sélectionnée' : 'Choisir'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- ÉTAPE 2 : FILIÈRES --- */}
        {selectedYear && (
          <div className="section" ref={filiereSectionRef} style={{marginTop: '60px', animation: 'slideUp 0.4s'}}>
            <h3 className="section-title">2. Filière <span style={{fontSize: '0.6em', color: '#666'}}>({selectedYear.name})</span></h3>

            {loadingFilieres && <p className="loading-text">Chargement des filières...</p>}

            {/* Empty State si vide */}
            {!loadingFilieres && filieres.length === 0 && (
               <div className="empty-state">
                 <div style={{fontSize: '40px'}}>📭</div>
                 <h3>Aucune filière trouvée</h3>
                 <p>Il n'y a pas de filières disponibles pour cette année.</p>
               </div>
            )}

            {!loadingFilieres && filieres.length > 0 && (
              <div className="modules-grid">
                {filieres.map((filiere) => (
                  <div
                    key={filiere.id}
                    className="module-card"
                    onClick={() => setSelectedFiliere(filiere)}
                    style={{
                      border: selectedFiliere?.id === filiere.id ? '2px solid #28a745' : '1px solid transparent', // Vert pour l'étape 2
                      background: selectedFiliere?.id === filiere.id ? '#f0fff4' : 'white'
                    }}
                  >
                    <div className="module-header">
                      <h3>{filiere.name || filiere.filiere_name}</h3>
                      {filiere.code && <span className="module-code">{filiere.code}</span>}
                    </div>
                    
                    {filiere.description && (
                      <p style={{fontSize: '0.9rem', color: '#777', marginBottom: '15px'}}>
                        {filiere.description.substring(0, 60)}...
                      </p>
                    )}
                    
                    <button className="select-module-btn" style={{
                       background: selectedFiliere?.id === filiere.id ? '#28a745' : '#f8f9fa',
                       color: selectedFiliere?.id === filiere.id ? 'white' : '#28a745',
                       borderColor: selectedFiliere?.id === filiere.id ? '#28a745' : '#dee2e6'
                    }}>
                      {selectedFiliere?.id === filiere.id ? 'Filière Sélectionnée' : 'Choisir'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- ÉTAPE 3 : CONFIRMATION --- */}
        {selectedYear && selectedFiliere && (
          <div ref={continueRef} style={{marginTop: '40px', paddingBottom: '40px', animation: 'fadeIn 0.5s'}}>
             <button className="continue-button" onClick={handleContinue}>
                Valider et voir les modules ➔
             </button>
          </div>
        )}

      </div>

            {/* DÉCORATION (Plus de triangles !) */}
      <div className="triangles-container">
        {[...Array(25)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div> // Fin du return
  );
}