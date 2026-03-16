import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";
const STORAGE_BASE = "https://podo.b1.ma/storage"; // CORRECTION IMPORTANTE

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  const { year, filiere, modules: preloadedModules } = location.state || {};

  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ ccs: [], efms: [], courses: [] });
  const [loadingResources, setLoadingResources] = useState(false);
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  // Fonction pour corriger les liens (ajout de /storage si manquant)
  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${STORAGE_BASE}/${cleanPath}`;
  };

  useEffect(() => { if (!year || !filiere) navigate("/selection"); }, [year, filiere, navigate]);

  // Charger Modules & EFFs
  useEffect(() => {
    if (!filiere?.id) return;

    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then(r => r.json()).then(d => { if(d.success) setModules(d.data); })
        .catch(() => {})
        .finally(() => setLoadingModules(false));
    }

    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then(r => r.json()).then(d => { if(d.success) setEffs(d.data); else setEffs([]); })
      .catch(() => setEffs([]))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // Charger Ressources (Cours, CC, EFM) au clic
  useEffect(() => {
    if (!selectedModule) return;
    setLoadingResources(true);
    setResources({ ccs: [], efms: [], courses: [] });

    const fetchResource = (url) => fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(json => {
         if (json.success && Array.isArray(json.data)) return json.data;
         if (Array.isArray(json)) return json;
         return [];
      })
      .catch(() => []);

    Promise.all([
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/ccs`),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/efms`),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/courses`)
    ]).then(([ccs, efms, courses]) => setResources({ ccs, efms, courses }))
      .finally(() => setLoadingResources(false));
  }, [selectedModule]);

  const handleModuleClick = (mod) => {
    setSelectedModule(selectedModule?.id === mod.id ? null : mod);
  };

  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container"><img src={logo} alt="Logo" /></div>
      </div>
      <div className="welcome-box">
        <h2>{year.name} - {filiere.name}</h2>
        <p>Cliquez sur un module pour afficher les ressources.</p>
      </div>

      <div className="main-content">
        {/* MODULES LIST */}
        <div className="section">
          <h2 className="section-title">Modules</h2>
          <div className="underline2"></div>
          {loadingModules ? <p>Chargement...</p> : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <div key={mod.id} className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                     onClick={() => handleModuleClick(mod)} style={{cursor:"pointer", border: selectedModule?.id===mod.id?"2px solid #007BFF":"none"}}>
                  <h3>{mod.name}</h3>
                  {mod.code && <span className="badge info">{mod.code}</span>}
                  
                  {/* DETAIL BOX */}
                  {selectedModule?.id === mod.id && (
                    <div className="module-details-box" style={{marginTop:"15px", borderTop:"1px solid #eee", paddingTop:"10px"}}>
                      {loadingResources ? <p style={{color:"#007BFF"}}>Chargement...</p> : (
                        <div style={{display:"flex", flexDirection:"column", gap:"10px", textAlign:"left"}}>
                          {/* Cours */}
                          <div><strong style={{color:"#007BFF"}}>📚 Cours ({resources.courses.length})</strong>
                            <ul style={{fontSize:"13px", paddingLeft:"15px"}}>{resources.courses.map(c=>(
                              <li key={c.id}><a href={getFileUrl(c.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link">{c.title||"Voir"}</a></li>
                            ))}</ul>
                          </div>
                          {/* CC */}
                          <div><strong style={{color:"#FFA500"}}>📝 CC ({resources.ccs.length})</strong>
                            <ul style={{fontSize:"13px", paddingLeft:"15px"}}>{resources.ccs.map(c=>(
                              <li key={c.id}><a href={getFileUrl(c.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color:"#FFA500"}}>{c.title||"Voir"}</a></li>
                            ))}</ul>
                          </div>
                          {/* EFM */}
                          <div><strong style={{color:"#28A745"}}>🎓 EFM ({resources.efms.length})</strong>
                            <ul style={{fontSize:"13px", paddingLeft:"15px"}}>{resources.efms.map(c=>(
                              <li key={c.id}><a href={getFileUrl(c.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color:"#28A745"}}>{c.title||"Voir"}</a></li>
                            ))}</ul>
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

        {/* EFFs LIST */}
        <div className="section" style={{marginTop:"50px"}}>
          <h2 className="section-title">Examens Fin de Formation (EFF)</h2>
          <div className="underline2" style={{background:"#28A745"}}></div>
          {loadingEffs ? <p>Recherche...</p> : effs.length===0 ? <p className="info-box warning">Aucun EFF disponible.</p> : (
            <div className="modules-grid">
              {effs.map(eff => (
                <div key={eff.id} className="module-card" style={{borderLeft:"5px solid #28A745"}}>
                  <h3>{eff.title || `EFF ${eff.year||""}`}</h3>
                  {eff.year && <span className="badge success">{eff.year}</span>}
                  <div style={{marginTop:"10px"}}>
                    <a href={getFileUrl(eff.file_path)} target="_blank" rel="noopener noreferrer" className="continue-button" 
                       style={{display:"inline-block", textDecoration:"none", fontSize:"14px", padding:"8px 20px"}}>Télécharger</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="continue-button" style={{marginTop:"40px", backgroundColor:"#6c757d"}} onClick={()=>navigate("/selection")}>Retour</button>
      </div>
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}