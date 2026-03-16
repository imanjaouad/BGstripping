import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";
const STORAGE_BASE = "https://podo.b1.ma/storage";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  const { year, filiere, modules: preloadedModules } = location.state || {};

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ courses: [], ccs: [], efms: [] });
  const [loadingResources, setLoadingResources] = useState(false);
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(true);

  // ====================== CHARGEMENT SÉCURISÉ ======================
  const safeFetch = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success && json.data && Array.isArray(json.data)) {
        return json.data;
      }
      return []; // même si success mais data null → on renvoie []
    } catch (err) {
      console.log("Erreur réseau :", url);
      return [];
    }
  };

  // Modules + EFF
  useEffect(() => {
    if (!filiere?.id) {
      navigate("/selection", { replace: true });
      return;
    }

    const load = async () => {
      setLoadingModules(true);
      setLoadingEffs(true);

      const [mods, effList] = await Promise.all([
        preloadedModules?.length > 0 
          ? preloadedModules 
          : safeFetch(`${API_BASE}/filieres/${filiere.id}/modules`),
        
        safeFetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      ]);

      setModules(mods || []);
      setEffs(effList || []);
      setLoadingModules(false);
      setLoadingEffs(false);
    };

    load();
  }, [filiere, preloadedModules, navigate]);

  // RESSOURCES DU MODULE (COURS + CC + EFM) → LA MÉTHODE QUI NE RATE JAMAIS
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);
    setResources({ courses: [], ccs: [], efms: [] });

    const loadAll = async () => {
      // ON COMMENCE PAR /exams → c'est là que TOUT est en 2025
      const exams = await safeFetch(`${API_BASE}/modules/${selectedModule.id}/exams`);
      const courses = await safeFetch(`${API_BASE}/modules/${selectedModule.id}/courses`);

      let ccs = [];
      let efms = [];

      if (exams && exams.length > 0) {
        ccs = exams.filter(e => 
          e.title?.toLowerCase().includes("cc") || 
          e.title?.toLowerCase().includes("contrôle") || 
          e.title?.toLowerCase().includes("ds")
        );
        efms = exams.filter(e => 
          e.title?.toLowerCase().includes("efm") || 
          e.title?.toLowerCase().includes("examen")
        );
      }

      setResources({ 
        courses: courses || [], 
        ccs: ccs || [], 
        efms: efms || [] 
      });
      setLoadingResources(false);
    };

    loadAll();
  }, [selectedModule]);

  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${STORAGE_BASE}/${path.replace(/^\/+/, "")}`;
  };

  const renderList = (items, label, icon, color) => {
    if (!items || items.length === 0)
      return <div className="empty-msg">Aucun {label}</div>;

    return (
      <ul className="res-list">
        {items.map((item) => (
          <li key={item.id || Math.random()}>
            <a href={getFileUrl(item.file_path || item.path)} target="_blank" rel="noopener noreferrer" className="res-link">
              <span className="icon" style={{ color }}>{icon}</span>
              {item.title || item.name || "Fichier"}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container"><img src={logo} alt="Étudia" /></div>
      </div>

      <div className="main-content">
        <div className="welcome-box animate-fadeIn">
          <h2>{filiere.name}</h2>
          <p>{year.name}</p>
        </div>

        {/* MODULES */}
        <h2 className="section-title">Vos Modules</h2>
        {loadingModules ? (
          <div className="loader"></div>
        ) : modules.length === 0 ? (
          <p>Aucun module trouvé.</p>
        ) : (
          <div className="modules-grid">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                onClick={() => setSelectedModule(selectedModule?.id === mod.id ? null : mod)}
              >
                <h3>{mod.name}</h3>
                {mod.code && <span className="badge">{mod.code}</span>}

                {/* DEBUG (enlève après) */}
                {selectedModule?.id === mod.id && (
                  <div style={{background:"#dc2626", color:"white", padding:8, borderRadius:8, fontSize:14}}>
                    {resources.courses.length} cours • {resources.ccs.length} CC • {resources.efms.length} EFM
                  </div>
                )}

                {selectedModule?.id === mod.id && (
                  <div className="module-details">
                    {loadingResources ? (
                      <div className="loader small"></div>
                    ) : (
                      <>
                        <div className="res-group">
                          <strong style={{color:"#8b5cf6"}}>📚 Cours</strong>
                          {renderList(resources.courses, "cours", "📚", "#8b5cf6")}
                        </div>

                        <div className="res-group">
                          <strong style={{color:"#f59e0b"}}>📝 CC</strong>
                          {renderList(resources.ccs, "CC", "📝", "#f59e0b")}
                        </div>

                        <div className="res-group">
                          <strong style={{color:"#ec4899"}}>🎯 EFM</strong>
                          {renderList(resources.efms, "EFM", "🎯", "#ec4899")}
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
        <div className="mt-lg">
          <h2 className="section-title">EFF (Fin de Formation)</h2>
          {loadingEffs ? <div className="loader"></div> : effs.length === 0 ? (
            <p className="empty-box">Aucun EFF disponible</p>
          ) : (
            <div className="modules-grid">
              {effs.map(eff => (
                <div key={eff.id} className="module-card">
                  <h3>{eff.title || "EFF"}</h3>
                  {eff.year && <span className="badge badge-success">{eff.year}</span>}
                  <a href={getFileUrl(eff.file_path)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    📥 Télécharger
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-back mt-lg" onClick={() => navigate("/selection")}>
          ← Retour
        </button>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}