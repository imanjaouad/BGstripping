import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer les données passées depuis la page de sélection
  const { year, filiere, modules: preloadedModules } = location.state || {};

  // --- ÉTATS ---

  // 1. Modules
  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);

  // 2. Ressources par Module (CC, EFM, Cours)
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ ccs: [], efms: [], courses: [] });
  const [loadingResources, setLoadingResources] = useState(false);

  // 3. EFF (Examens de Fin de Formation - liés à la Filière)
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  const [error, setError] = useState("");

  // --- EFFETS (API) ---

  // Protection : redirection si pas de données
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection");
    }
  }, [year, filiere, navigate]);

  // Chargement des Modules (si pas déjà chargés) ET des EFFs (toujours chargés ici)
  useEffect(() => {
    if (!filiere?.id) return;

    // 1. Charger les Modules (si besoin)
    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) setModules(data.data);
        })
        .catch(() => setError("Erreur modules"))
        .finally(() => setLoadingModules(false));
    }

    // 2. Charger les EFFs de la Filière (NOUVEAU)
    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setEffs(data.data);
        }
      })
      .catch((err) => console.error("Erreur EFFs", err))
      .finally(() => setLoadingEffs(false));

  }, [filiere, preloadedModules]);

  // Chargement des ressources d'un module au clic
  useEffect(() => {
    if (!selectedModule) return;

    setLoadingResources(true);
    setResources({ ccs: [], efms: [], courses: [] });

    Promise.all([
      fetch(`${API_BASE}/modules/${selectedModule.id}/ccs`).then(r => r.json()),
      fetch(`${API_BASE}/modules/${selectedModule.id}/efms`).then(r => r.json()),
      fetch(`${API_BASE}/modules/${selectedModule.id}/courses`).then(r => r.json())
    ])
    .then(([ccsData, efmsData, coursesData]) => {
      setResources({
        ccs: ccsData.success ? ccsData.data : [],
        efms: efmsData.success ? efmsData.data : [],
        courses: coursesData.success ? coursesData.data : []
      });
    })
    .catch((err) => console.error("Erreur ressources", err))
    .finally(() => setLoadingResources(false));

  }, [selectedModule]);

  // Gestion du clic module
  const handleModuleClick = (module) => {
    if (selectedModule?.id === module.id) {
      setSelectedModule(null);
    } else {
      setSelectedModule(module);
    }
  };

  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>{year.name} - {filiere.name}</h2>
        <p>Accédez aux cours par module et aux examens de fin de formation.</p>
      </div>

      <div className="main-content">
        
        {/* === SECTION 1 : MODULES === */}
        <div className="section">
          <h2 className="section-title">Liste des Modules</h2>
          <div className="underline2"></div>

          {loadingModules ? (
            <p>Chargement des modules...</p>
          ) : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <div 
                  key={mod.id} 
                  className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                  onClick={() => handleModuleClick(mod)}
                  style={{ cursor: "pointer", border: selectedModule?.id === mod.id ? "2px solid var(--primary-blue)" : "none" }}
                >
                  <h3>{mod.name}</h3>
                  {mod.code && <span className="badge info">{mod.code}</span>}
                  
                  {/* Détails du module (Cours, CC, EFM) */}
                  {selectedModule?.id === mod.id && (
                    <div className="module-details-box" style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
                      
                      {loadingResources ? (
                        <p style={{color: "#007BFF"}}>Chargement...</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                          
                          {/* Cours */}
                          <div>
                            <strong style={{color: "var(--primary-blue)"}}>📚 Cours ({resources.courses.length})</strong>
                            {resources.courses.length > 0 ? (
                              <ul style={{fontSize: "14px", marginTop: "5px"}}>
                                {resources.courses.map(c => (
                                  <li key={c.id}>
                                    <a href={c.file_path} target="_blank" rel="noopener noreferrer" className="efm-link">
                                      {c.title || "Télécharger"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#999"}}>Aucun cours</div>}
                          </div>

                          {/* CC */}
                          <div>
                            <strong style={{color: "var(--warning-orange)"}}>📝 Contrôles ({resources.ccs.length})</strong>
                            {resources.ccs.length > 0 ? (
                              <ul style={{fontSize: "14px", marginTop: "5px"}}>
                                {resources.ccs.map(cc => (
                                  <li key={cc.id}>
                                    <a href={cc.file_path} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "var(--warning-orange)"}}>
                                      {cc.title || "Télécharger"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#999"}}>Aucun CC</div>}
                          </div>

                          {/* EFM Local */}
                          <div>
                            <strong style={{color: "var(--success-green)"}}>🎓 EFM Module ({resources.efms.length})</strong>
                            {resources.efms.length > 0 ? (
                              <ul style={{fontSize: "14px", marginTop: "5px"}}>
                                {resources.efms.map(efm => (
                                  <li key={efm.id}>
                                    <a href={efm.file_path} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "var(--success-green)"}}>
                                      {efm.title || "Télécharger"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#999"}}>Aucun EFM</div>}
                          </div>

                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === SECTION 2 : EFF (Examens de Fin de Formation) === */}
        <div className="section" style={{ marginTop: "50px" }}>
          <h2 className="section-title">Examens de Fin de Formation (EFF)</h2>
          <div className="underline2" style={{ background: "var(--success-green)" }}></div>

          {loadingEffs ? (
            <p>Chargement des EFFs...</p>
          ) : effs.length === 0 ? (
            <div className="info-box warning">Aucun EFF disponible pour cette filière.</div>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div key={eff.id} className="module-card" style={{ borderLeft: "5px solid var(--success-green)" }}>
                  <h3>{eff.title || `EFF ${eff.year || ""}`}</h3>
                  {eff.year && <span className="badge success">{eff.year}</span>}
                  <div style={{ marginTop: "10px" }}>
                    <a 
                      href={eff.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="continue-button"
                      style={{ display: "inline-block", textDecoration: "none", fontSize: "14px", padding: "8px 20px" }}
                    >
                      Télécharger le Sujet
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="continue-button" style={{marginTop: "40px", backgroundColor: "#6c757d"}} onClick={() => navigate("/selection")}>
          Retour au choix des filières
        </button>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}