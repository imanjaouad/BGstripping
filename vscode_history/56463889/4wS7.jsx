import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";
const STORAGE_BASE = "https://podo.b1.ma/storage";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupération sécurisée des données
  const stateData = location.state || {};
  const { year, filiere, modules: preloadedModules } = stateData;

  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ ccs: [], efms: [], courses: [] });
  const [loadingResources, setLoadingResources] = useState(false);
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  // Correction des liens
  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${STORAGE_BASE}/${cleanPath}`;
  };

  // 1. SÉCURITÉ : Redirection immédiate si données manquantes
  useEffect(() => {
    if (!year || !filiere) {
      console.warn("Données manquantes, redirection...");
      navigate("/selection", { replace: true });
    }
  }, [year, filiere, navigate]);

  // 2. Chargement API (Modules + EFF)
  useEffect(() => {
    if (!filiere?.id) return;

    // Modules
    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then(r => r.json()).then(d => { if(d.success) setModules(d.data); })
        .catch(console.error)
        .finally(() => setLoadingModules(false));
    }

    // EFFs
    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then(r => r.json()).then(d => { if(d.success) setEffs(d.data); })
      .catch(() => setEffs([]))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // 3. Chargement Ressources au clic
  useEffect(() => {
    if (!selectedModule) return;
    setLoadingResources(true);
    setResources({ ccs: [], efms: [], courses: [] });

    const fetchRes = (url) => fetch(url).then(r => r.ok ? r.json() : []).then(j => (j.success && Array.isArray(j.data)) ? j.data : []).catch(()=>[]);

    Promise.all([
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/ccs`),
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/efms`),
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/courses`)
    ]).then(([ccs, efms, courses]) => setResources({ ccs, efms, courses }))
      .finally(() => setLoadingResources(false));
  }, [selectedModule]);

  // --- RENDU DES LISTES ---
  const renderList = (items, label, icon) => {
    if (!items || items.length === 0) return <div className="empty-msg">Aucun {label}</div>;
    return (
      <ul className="res-list">
        {items.map(item => (
          <li key={item.id}>
            <a href={getFileUrl(item.file_path)} target="_blank" rel="noopener noreferrer" className="res-link">
              <span className="icon">{icon}</span> {item.title || item.name || "Télécharger"}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  // !!! IMPORTANT : Empêche le crash si filiere est null avant la redirection
  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container"><img src={logo} alt="Logo" /></div>
      </div>

      <div className="main-content">
        <div className="welcome-box">
          <h2>{filiere.name}</h2>
          <p>{year.name}</p>
        </div>

        {/* MODULES */}
        <h2 className="section-title">Vos Modules</h2>
        {loadingModules ? <div className="loader"></div> : (
          <div className="modules-grid">
            {modules.map((mod) => (
              <div 
                key={mod.id} 
                className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                onClick={() => setSelectedModule(selectedModule?.id === mod.id ? null : mod)}
              >
                <h3>{mod.name}</h3>
                {mod.code && <span className="badge">{mod.code}</span>}

                {/* DÉTAILS */}
                {selectedModule?.id === mod.id && (
                  <div className="module-details">
                    {loadingResources ? <div className="loader small"></div> : (
                      <>
                        <div className="res-group">
                          <strong style={{color:"#2563EB"}}>Cours</strong>
                          {renderList(resources.courses, "cours", "📚")}
                        </div>
                        <div className="res-group">
                          <strong style={{color:"#F59E0B"}}>Contrôles</strong>
                          {renderList(resources.ccs, "contrôle", "📝")}
                        </div>
                        <div className="res-group">
                          <strong style={{color:"#10B981"}}>EFM</strong>
                          {renderList(resources.efms, "EFM", "🎓")}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EFF */}
        <div style={{marginTop: "50px"}}>
          <h2 className="section-title">Examens de Fin de Formation</h2>
          {loadingEffs ? <div className="loader"></div> : effs.length === 0 ? <p className="empty-box">Aucun EFF disponible.</p> : (
            <div className="modules-grid">
              {effs.map(eff => (
                <div key={eff.id} className="module-card">
                  <h3>{eff.title || `EFF ${eff.year || ""}`}</h3>
                  {eff.year && <span className="badge success">{eff.year}</span>}
                  <div style={{marginTop:"15px"}}>
                    <a href={getFileUrl(eff.file_path)} target="_blank" rel="noopener noreferrer" className="btn-download">
                      📥 Télécharger le sujet
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-back" onClick={() => navigate("/selection")}>← Retour au choix</button>
      </div>
      {/* Triangles = Fond montagne */}
<div className="triangles-container">
  {[...Array(12)].map((_, i) => (
    <div key={i} className="triangle"></div>
  ))}
</div>
    </div>
  );
}