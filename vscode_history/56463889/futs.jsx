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
  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  
  // Ressources sélectionnées
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ ccs: [], efms: [], courses: [] });
  const [loadingResources, setLoadingResources] = useState(false);

  // EFFs (Filière)
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  const [error, setError] = useState("");

  // --- API ---

  // 1. Redirection si données manquantes
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection");
    }
  }, [year, filiere, navigate]);

  // 2. Charger Modules + EFFs
  useEffect(() => {
    if (!filiere?.id) return;

    // Charger Modules
    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) setModules(data.data);
        })
        .catch(() => setError("Erreur chargement modules"))
        .finally(() => setLoadingModules(false));
    }

    // Charger EFFs
    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then((res) => res.json())
      .then((data) => {
        // Sécurisation: on vérifie si data.data existe
        if (data.success && Array.isArray(data.data)) {
          setEffs(data.data);
        } else {
          setEffs([]);
        }
      })
      .catch((err) => {
        console.error("Erreur EFFs:", err);
        setEffs([]);
      })
      .finally(() => setLoadingEffs(false));

  }, [filiere, preloadedModules]);

  // 3. Charger Ressources (CC, EFM, Cours) - CORRIGÉ ET ROBUSTE
  useEffect(() => {
    if (!selectedModule) return;

    setLoadingResources(true);
    // On vide avant de charger pour éviter de voir les anciens
    setResources({ ccs: [], efms: [], courses: [] });

    // Fonction helper pour fetcher sans planter
    const fetchResource = (url, typeName) => {
      return fetch(url)
        .then(res => {
          if (!res.ok) {
            // Si 404 ou 500, on renvoie un tableau vide
            console.warn(`${typeName} introuvable ou erreur (Status: ${res.status})`);
            return [];
          }
          return res.json();
        })
        .then(json => {
          console.log(`Données ${typeName} reçues:`, json);
          // On accepte { success: true, data: [...] } OU juste [...]
          if (json.success && Array.isArray(json.data)) return json.data;
          if (Array.isArray(json)) return json;
          return [];
        })
        .catch(err => {
          console.error(`Erreur fetch ${typeName}:`, err);
          return [];
        });
    };

    Promise.all([
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/ccs`, "CCs"),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/efms`, "EFMs"),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/courses`, "Courses")
    ])
    .then(([ccsData, efmsData, coursesData]) => {
      setResources({
        ccs: ccsData,
        efms: efmsData,
        courses: coursesData
      });
    })
    .finally(() => setLoadingResources(false));

  }, [selectedModule]);

  // Gestion Clic
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
        <p>Cliquez sur un module pour voir son contenu.</p>
      </div>

      <div className="main-content">
        
        {/* === MODULES === */}
        <div className="section">
          <h2 className="section-title">Modules</h2>
          <div className="underline2"></div>

          {loadingModules ? (
            <p>Chargement...</p>
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
                  
                  {/* ZONE DÉTAILS (Visible si sélectionné) */}
                  {selectedModule?.id === mod.id && (
                    <div className="module-details-box" style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
                      
                      {loadingResources ? (
                        <p style={{color: "#007BFF", fontSize: "14px"}}>Chargement des fichiers...</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>
                          
                          {/* 1. COURS */}
                          <div>
                            <strong style={{color: "var(--primary-blue)"}}>📚 Cours ({resources.courses.length})</strong>
                            {resources.courses.length > 0 ? (
                              <ul style={{fontSize: "13px", marginTop: "5px", paddingLeft: "15px"}}>
                                {resources.courses.map(c => (
                                  <li key={c.id}>
                                    <a href={c.file_path} target="_blank" rel="noopener noreferrer" className="efm-link">
                                      {c.title || c.name || "Voir le cours"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#888", fontStyle: "italic"}}>Aucun cours trouvé.</div>}
                          </div>

                          {/* 2. CC (Contrôles) */}
                          <div>
                            <strong style={{color: "var(--warning-orange)"}}>📝 Contrôles ({resources.ccs.length})</strong>
                            {resources.ccs.length > 0 ? (
                              <ul style={{fontSize: "13px", marginTop: "5px", paddingLeft: "15px"}}>
                                {resources.ccs.map(cc => (
                                  <li key={cc.id}>
                                    <a href={cc.file_path} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "var(--warning-orange)"}}>
                                      {cc.title || cc.name || "Voir le CC"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#888", fontStyle: "italic"}}>Aucun CC trouvé.</div>}
                          </div>

                          {/* 3. EFM Module */}
                          <div>
                            <strong style={{color: "var(--success-green)"}}>🎓 EFM ({resources.efms.length})</strong>
                            {resources.efms.length > 0 ? (
                              <ul style={{fontSize: "13px", marginTop: "5px", paddingLeft: "15px"}}>
                                {resources.efms.map(efm => (
                                  <li key={efm.id}>
                                    <a href={efm.file_path} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "var(--success-green)"}}>
                                      {efm.title || efm.name || "Voir l'EFM"}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : <div style={{fontSize: "12px", color: "#888", fontStyle: "italic"}}>Aucun EFM trouvé.</div>}
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

        {/* === EFFs (Fin de Formation) === */}
        <div className="section" style={{ marginTop: "50px" }}>
          <h2 className="section-title">Examens Fin de Formation (EFF)</h2>
          <div className="underline2" style={{ background: "var(--success-green)" }}></div>

          {loadingEffs ? (
            <p>Recherche des EFFs...</p>
          ) : effs.length === 0 ? (
            <div className="info-box warning">Aucun EFF disponible pour le moment.</div>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div key={eff.id} className="module-card" style={{ borderLeft: "5px solid var(--success-green)" }}>
                  <h3>{eff.title || `Sujet EFF ${eff.year || ""}`}</h3>
                  {eff.year && <span className="badge success">{eff.year}</span>}
                  <div style={{ marginTop: "10px" }}>
                    <a 
                      href={eff.file_path} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="continue-button"
                      style={{ display: "inline-block", textDecoration: "none", fontSize: "14px", padding: "8px 20px" }}
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="continue-button" style={{marginTop: "40px", backgroundColor: "#6c757d"}} onClick={() => navigate("/selection")}>
          Retour
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