import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  const selection = location.state?.selection;

  const { filiere_id, annee, niveau } = selection || {};

  const [modules, setModules] = useState([]);
  const [filiere, setFiliere] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ccs, setCcs] = useState({});
  const [efms, setEfms] = useState({});
  const [loadingModuleId, setLoadingModuleId] = useState(null);

  // Empêcher accès direct
  useEffect(() => {
    if (!filiere_id) navigate("/selection");
  }, [filiere_id, navigate]);

  useEffect(() => {
    if (!filiere_id) return;

    setLoading(true);

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setModules(json.data || []);
          setFiliere(json.filiere || null);
        } else setError("Modules introuvables");

        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement");
        setLoading(false);
      });
  }, [filiere_id]);

  const loadCCEFM = (moduleId) => {
    setLoadingModuleId(moduleId);

    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/ccs`)
      .then(res => res.json())
      .then(json => setCcs(prev => ({ ...prev, [moduleId]: json.data || [] })))
      .catch(() => setCcs(prev => ({ ...prev, [moduleId]: [] })));

    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/efms`)
      .then(res => res.json())
      .then(json => setEfms(prev => ({ ...prev, [moduleId]: json.data || [] })))
      .catch(() => setEfms(prev => ({ ...prev, [moduleId]: [] })));

    setLoadingModuleId(null);
  };

  return (
    <div className="container">

      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>Vos modules 📚</h2>
        <p>Choisissez un module pour voir CC & EFM</p>
      </div>

      <div className="main-content">
        <h2 className="section-title">
          {niveau} - {annee?.name}
        </h2>

        {filiere && <p className="filiere-info">Filière : {filiere.name}</p>}

        {loading && <p>Chargement...</p>}
        {error && <p>{error}</p>}
        {!loading && modules.length === 0 && <p>Aucun module trouvé</p>}

        <div className="modules-grid">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <div className="module-header">
                <h3>{m.name}</h3>
                <span className="module-code">{m.code}</span>
              </div>

              <p>Crédits : {m.credits} | Heures : {m.total_hours}</p>
              <p>Professeur : {m.instructor}</p>

              <button
                className="select-module-btn"
                onClick={() => loadCCEFM(m.id)}
              >
                Voir CC & EFM
              </button>

              {loadingModuleId === m.id && <p>Chargement...</p>}

              {ccs[m.id] && (
                <div className="cc-section">
                  <strong>📘 CC</strong>
                  <ul>
                    {ccs[m.id].length === 0
                      ? <li>Aucun CC</li>
                      : ccs[m.id].map(cc => <li key={cc.id}>{cc.title}</li>)
                    }
                  </ul>
                </div>
              )}

              {efms[m.id] && (
                <div className="efm-section">
                  <strong>📝 EFM</strong>
                  <ul>
                    {efms[m.id].length === 0
                      ? <li>Aucun EFM</li>
                      : efms[m.id].map(e => <li key={e.id}>{e.title}</li>)
                    }
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}
