import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaSelection() {
  const navigate = useNavigate();

  // États
  const [annees, setAnnees] = useState([]);
  const [loadingAnnees, setLoadingAnnees] = useState(true);
  const [selectedAnnee, setSelectedAnnee] = useState(null);

  const [filieres, setFilieres] = useState([]);
  const [loadingFilieres, setLoadingFilieres] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(null);

  const [niveauSelectionne, setNiveauSelectionne] = useState(null);

  const niveaux = ["Technicien", "Technicien Spécialisé"];

  // Fetch années
  useEffect(() => {
    setLoadingAnnees(true);
    fetch("https://podo.b1.ma/api/public/years")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setAnnees(data.data);
        }
        setLoadingAnnees(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingAnnees(false);
      });
  }, []);

  // Fetch filières lorsque l'année change
  useEffect(() => {
    if (!selectedAnnee) return;

    setLoadingFilieres(true);
    fetch(`https://podo.b1.ma/api/public/years/${selectedAnnee.id}/filieres`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFilieres(data.data);
        } else {
          setFilieres([]);
        }
        setLoadingFilieres(false);
      })
      .catch((err) => {
        console.error(err);
        setFilieres([]);
        setLoadingFilieres(false);
      });
  }, [selectedAnnee]);

  // Continuer vers modules
  const handleContinue = () => {
    if (!selectedAnnee || !selectedFiliere || !niveauSelectionne) return;

    navigate("/modules", {
      state: {
        selection: {
          annee: selectedAnnee,
          filiere: selectedFiliere,
          niveau: niveauSelectionne,
        },
      },
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>Bienvenue sur votre espace étudiant 🎓</h2>
        <p>Choisissez votre année, filière et niveau.</p>
      </div>

      <div className="main-content">
        {/* Année */}
        <div className="section">
          <h2 className="section-title">Année :</h2>
          {loadingAnnees ? (
            <p>Chargement des années...</p>
          ) : (
            <div className="button-group">
              {annees.map((annee) => (
                <button
                  key={annee.id}
                  className={`button ${selectedAnnee?.id === annee.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedAnnee(annee);
                    setSelectedFiliere(null); // reset filière
                  }}
                >
                  {annee.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filière */}
        {selectedAnnee && (
          <div className="section">
            <h2 className="section-title">Filière :</h2>
            {loadingFilieres ? (
              <p>Chargement des filières...</p>
            ) : (
              <div className="button-group">
                {filieres.map((f) => (
                  <button
                    key={f.id}
                    className={`button ${selectedFiliere?.id === f.id ? "active" : ""}`}
                    onClick={() => setSelectedFiliere(f)}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Niveau */}
        {selectedFiliere && (
          <div className="section">
            <h2 className="section-title">Niveau :</h2>
            <div className="button-group">
              {niveaux.map((n) => (
                <button
                  key={n}
                  className={`button ${niveauSelectionne === n ? "active" : ""}`}
                  onClick={() => setNiveauSelectionne(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bouton continuer */}
        {selectedAnnee && selectedFiliere && niveauSelectionne && (
          <div className="info-box">
            <p>Année : {selectedAnnee.name}</p>
            <p>Filière : {selectedFiliere.name}</p>
            <p>Niveau : {niveauSelectionne}</p>
            <button className="continue-button" onClick={handleContinue}>
              Continuer
            </button>
          </div>
        )}
      </div>

      {/* Décor */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}
