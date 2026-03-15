import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules({ selection }) {
  const { filiere_id, annee, niveau } = selection || {};

  const [modules, setModules] = useState([]);
  const [filiere, setFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ccs, setCcs] = useState({});
  const [efms, setEfms] = useState({});
  const [loadingModuleId, setLoadingModuleId] = useState(null);

  /* =======================
     CHARGER LES MODULES
  ======================== */
  useEffect(() => {
    if (!filiere_id) return;

    setLoading(true);
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then(res => {
        if (!res.ok) throw new Error("Erreur API modules");
        return res.json();
      })
      .then(json => {
        if (json.success) {
          setModules(json.data || []);
          setFiliere(json.filiere || null);
        } else {
          setError("Modules introuvables");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filiere_id]);

  /* =======================
     CHARGER CC + EFM
  ======================== */
  const loadCCEFM = (moduleId) => {
    setLoadingModuleId(moduleId);

    // CC
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/ccs`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setCcs(prev => ({ ...prev, [moduleId]: json.data || [] }));
        } else {
          setCcs(prev => ({ ...prev, [moduleId]: [] }));
        }
        setLoadingModuleId(null);
      })
      .catch(() => {
        setCcs(prev => ({ ...prev, [moduleId]: [] }));
        setLoadingModuleId(null);
      });

    // EFM
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/efms`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setEfms(prev => ({ ...prev, [moduleId]: json.data || [] }));
        } else {
          setEfms(prev => ({ ...prev, [moduleId]: [] }));
        }
      })
      .catch(() => {
        setEfms(prev => ({ ...prev, [moduleId]: [] }));
      });
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* Welcome */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace modules 📚</h2>
        <p>Choisissez un module pour voir les CC et EFM.</p>
      </div>

      {/* Main */}
      <div className="main-content">
        <h2 className="section-title">
          Modules pour {niveau} - {annee?.name}
        </h2>

        {filiere && <p className="filiere-info">Filière : {filiere.name}</p>}

        {loading && <p>Chargement des modules...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && modules.length === 0 && <p>Aucun module trouvé.</p>}

        <div className="modules-grid">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <div className="module-header">
                <h3>{m.name}</h3>
                <span className="module-code">{m.code}</span>
              </div>

              <p>
                Crédits : {m.credits} | Heures : {m.total_hours}
              </p>

              <p>Professeur : {m.instructor}</p>

              <button
                className="select-module-btn"
                onClick={() => loadCCEFM(m.id)}
              >
                Voir CC & EFM
              </button>

              {/* Loading */}
              {loadingModuleId === m.id && <p>Chargement...</p>}

              {/* CC */}
              {ccs[m.id] && (
                <div className="cc-section">
                  <strong>📘 Contrôles Continus</strong>
                  <ul>
                    {ccs[m.id].length === 0 ? (
                      <li>Aucun CC</li>
                    ) : (
                      ccs[m.id].map(cc => (
                        <li key={cc.id}>
                          {cc.title || cc.name || `CC ${cc.id}`}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* EFM */}
              {efms[m.id] && (
                <div className="efm-section">
                  <strong>📝 Examens Finaux</strong>
                  <ul>
                    {efms[m.id].length === 0 ? (
                      <li>Aucun EFM</li>
                    ) : (
                      efms[m.id].map(e => (
                        <li key={e.id}>
                          {e.title || `EFM ${e.id}`}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
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
