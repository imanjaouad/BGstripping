// src/pages/EtudiaModules.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";
const STORAGE_BASE = "https://podo.b1.ma/storage";

export default function EtudiaModules() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { year, filiere } = state || {};

  const [modules, setModules] = useState([]);
  const [effs, setEffs] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ courses: [], ccs: [], efms: [] });
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingEffs, setLoadingEffs] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);

  const fetchAPI = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      return [];
    }
  };

  // 3. Modules + 8. EFF par filière
  useEffect(() => {
    if (!filiere?.id) return navigate("/");

    const load = async () => {
      setLoadingModules(true);
      setLoadingEffs(true);

      const [mods, effList] = await Promise.all([
        fetchAPI(`${API_BASE}/filieres/${filiere.id}/modules`),
        fetchAPI(`${API_BASE}/filieres/${filiere.id}/effs`)
      ]);

      setModules(mods);
      setEffs(effList);
      setLoadingModules(false);
      setLoadingEffs(false);
    };

    load();
  }, [filiere, navigate]);

  // 5,6,7. CC + EFM + Cours par module
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);

    const loadResources = async () => {
      const [courses, ccs, efms] = await Promise.all([
        fetchAPI(`${API_BASE}/modules/${selectedModule.id}/courses`),
        fetchAPI(`${API_BASE}/modules/${selectedModule.id}/ccs`),
        fetchAPI(`${API_BASE}/modules/${selectedModule.id}/efms`) // parfois vide → mais on garde
          .then(data => data.length > 0 ? data : fetchAPI(`${API_BASE}/modules/${selectedModule.id}/exams`)) // fallback
      ]);

      setResources({ courses, ccs, efms });
      setLoadingResources(false);
    };

    loadResources();
  }, [selectedModule]);

  const getFileUrl = (path) => {
    if (!path) return "#";
    return path.startsWith("http") ? path : `${STORAGE_BASE}/${path.replace(/^\/+/, "")}`;
  };

  const renderList = (items, label, icon) => {
    if (!items?.length) return <div className="empty-msg">Aucun {label}</div>;
    return (
      <ul className="res-list">
        {items.map((item, i) => (
          <li key={i}>
            <a href={getFileUrl(item.file_path || item.path)} target="_blank" rel="noopener noreferrer" className="res-link">
              <span className="icon">{icon}</span> {item.title || item.name || "Fichier"}
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

        {/* Modules */}
        <h2 className="section-title">Modules</h2>
        {loadingModules ? <div className="loader"></div> : (
          <div className="modules-grid">
            {modules.map(mod => (
              <div
                key={mod.id}
                className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                onClick={() => setSelectedModule(selectedModule?.id === mod.id ? null : mod)}
              >
                <h3>{mod.name}</h3>
                {mod.code && <span className="badge">{mod.code}</span>}

                {selectedModule?.id === mod.id && (
                  <>
                    <div style={{ background: "#10b981", color: "white", padding: 10, borderRadius: 8, fontWeight: "bold" }}>
                      {resources.courses.length} Cours • {resources.ccs.length} CC • {resources.efms.length} EFM
                    </div>

                    {loadingResources ? <div className="loader small"></div> : (
                      <>
                        <div className="res-group"><strong style={{color:"#8b5cf6"}}>📚 Cours</strong>{renderList(resources.courses, "cours", "📚")}</div>
                        <div className="res-group"><strong style={{color:"#f59e0b"}}>📝 CC</strong>{renderList(resources.ccs, "CC", "📝")}</div>
                        <div className="res-group"><strong style={{color:"#ec4899"}}>🎯 EFM</strong>{renderList(resources.efms, "EFM", "🎯")}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EFF */}
        <div className="mt-lg">
          <h2 className="section-title">Examens de Fin de Formation (EFF)</h2>
          {loadingEffs ? <div className="loader"></div> : effs.length === 0 ? (
            <p className="empty-box">Aucun EFF disponible</p>
          ) : (
            <div className="modules-grid">
              {effs.map(eff => (
                <div key={eff.id} className="module-card">
                  <h3>{eff.title || "EFF"}</h3>
                  <a href={getFileUrl(eff.file_path)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    📥 Télécharger
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-back mt-lg" onClick={() => navigate("/")}>
          ← Changer de filière
        </button>
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}