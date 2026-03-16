import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const { selection } = location.state || {};
  const { filiere_id, annee, niveau } = selection || {};

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ccs, setCcs] = useState({});
  const [efms, setEfms] = useState({});
  const [cours, setCours] = useState({});
  const [effs, setEffs] = useState([]);

  const [loadingModuleId, setLoadingModuleId] = useState(null);

  // Charger les modules
  useEffect(() => {
    if (!filiere_id) return;

    setLoading(true);
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setModules(json.data || []);
        else setError("Modules introuvables");
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filiere_id]);

  // Charger EFF (par filière)
  useEffect(() => {
    if (!filiere_id) return;

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setEffs(json.data || []);
        else setEffs([]);
      })
      .catch(() => setEffs([]));
  }, [filiere_id]);

  // Charger CC, EFM, et Cours pour un module donné
  const loadModuleData = (moduleId) => {
    setLoadingModuleId(moduleId);

    // CC
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/ccs`)
      .then(res => res.json())
      .then(json => setCcs(prev => ({ ...prev, [moduleId]: json.data || [] })))
      .catch(() => setCcs(prev => ({ ...prev, [moduleId]: [] })));

    // EFM
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/efms`)
      .then(res => res.json())
      .then(json => setEfms(prev => ({ ...prev, [moduleId]: json.data || [] })))
      .catch(() => setEfms(prev => ({ ...prev, [moduleId]: [] })));

    // Cours
    fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/cours`)
      .then(res => res.json())
      .then(json => setCours(prev => ({ ...prev, [moduleId]: json.data || [] })))
      .catch(() => setCours(prev => ({ ...prev, [moduleId]: [] })));

    setLoadingModuleId(null);
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
        <h2>Modules pour {niveau} - {annee?.name}</h2>
        <p>Choisissez un module pour voir CC, EFM et Cours.</p>
      </div>

      <div className="main-content">
        {loading && <p>Chargement des modules...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && modules.length === 0 && <p>Aucun module trouvé.</p>}

        <div className="modules-grid">
          {modules.map(m => (
            <div key={m.id} className="module-card">
              <h3>{m.name}</h3>
              <span className="module-code">{m.code}</span>
              <p>Crédits : {m.credits} | Heures : {m.total_hours}</p>
              <p>Professeur : {m.instructor}</p>

              <button
                className="select-module-btn"
                onClick={() => loadModuleData(m.id)}
              >
                Voir CC, EFM et Cours
              </button>

              {loadingModuleId === m.id && <p>Chargement...</p>}

              {/* CC */}
              {ccs[m.id] && (
                <div>
                  <strong>📘 Contrôles Continus (CC)</strong>
                  <ul>
                    {ccs[m.id].length === 0 ? (
                      <li>Aucun CC</li>
                    ) : (
                      ccs[m.id].map(cc => <li key={cc.id}>{cc.title || cc.name}</li>)
                    )}
                  </ul>
                </div>
              )}

              {/* EFM */}
              {efms[m.id] && (
                <div>
                  <strong>📝 Examens Finaux (EFM)</strong>
                  <ul>
                    {efms[m.id].length === 0 ? (
                      <li>Aucun EFM</li>
                    ) : (
                      efms[m.id].map(e => <li key={e.id}>{e.title || `EFM ${e.id}`}</li>)
                    )}
                  </ul>
                </div>
              )}

              {/* Cours */}
              {cours[m.id] && (
                <div>
                  <strong>📚 Cours</strong>
                  <ul>
                    {cours[m.id].length === 0 ? (
                      <li>Aucun cours</li>
                    ) : (
                      cours[m.id].map(c => <li key={c.id}>{c.title || c.name}</li>)
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* EFF (Filière) */}
        <div className="section">
          <h3>🗂 EFF pour cette filière :</h3>
          <ul>
            {effs.length === 0 ? <li>Aucun EFF</li> : effs.map(eff => <li key={eff.id}>{eff.name}</li>)}
          </ul>
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
