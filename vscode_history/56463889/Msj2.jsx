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

  // FONCTION MAGIQUE QUI RÉCUPÈRE TOUT, MÊME SI L'API EST MOCHE
  const fetchEverything = async (url) => {
    try {
      const res = await fetch(url, { cache: "no-store" }); // force refresh
      if (!res.ok) return [];
      const json = await res.json();
      if (json.success && json.data && Array.isArray(json.data)) return json.data;
      if (Array.isArray(json.data)) return json.data;
      if (json.data && typeof json.data === "object") return Object.values(json.data);
      return [];
    } catch (err) {
      return [];
    }
  };

  // CHARGEMENT MODULES + EFF
  useEffect(() => {
    if (!filiere?.id) return navigate("/selection", { replace: true });

    const load = async () => {
      setLoadingModules(true);
      setLoadingEffs(true);

      const mods = preloadedModules?.length > 0 
        ? preloadedModules 
        : await fetchEverything(`${API_BASE}/filieres/${filiere.id}/modules`);

      const effList = await fetchEverything(`${API_BASE}/filieres/${filiere.id}/effs`);

      setModules(mods);
      setEffs(effList);
      setLoadingModules(false);
      setLoadingEffs(false);
    };

    load();
  }, [filiere, preloadedModules, navigate]);

  // CHARGEMENT RESSOURCES → ON VA TOUT CHERCHER DANS TOUS LES ENDPOINTS POSSIBLES
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);
    setResources({ courses: [], ccs: [], efms: [] });

    const loadAllPossible = async () => {
      const id = selectedModule.id;

      // Tous les endpoints possibles en 2025
      const promises = await Promise.allSettled([
        fetchEverything(`${API_BASE}/modules/${id}/courses`),
        fetchEverything(`${API_BASE}/modules/${id}/exams`),
        fetchEverything(`${API_BASE}/modules/${id}/module-exams`),
        fetchEverything(`${API_BASE}/modules/${id}/ccs`),
        fetchEverything(`${API_BASE}/modules/${id}/efms`),
        fetchEverything(`${API_BASE}/modules/${id}/resources`),
      ]);

      let allItems = [];
      promises.forEach(p => {
        if (p.status === "fulfilled" && p.value.length > 0) {
          allItems = [...allItems, ...p.value];
        }
      });

      // Suppression des doublons par file_path ou title
      const uniqueItems = Array.from(new Map(allItems.map(item => [item.file_path || item.title, item])).values());

      // Séparation intelligente
      const courses = uniqueItems.filter(i => 
        i.type === "course" || 
        i.title?.toLowerCase().includes("cour") || 
        i.title?.toLowerCase().includes("td") || 
        i.title?.toLowerCase().includes("tp")
      );

      const ccs = uniqueItems.filter(i => 
        i.title?.toLowerCase().includes("cc") || 
        i.title?.toLowerCase().includes("contrôle") || 
        i.title?.toLowerCase().includes("ds") ||
        i.title?.toLowerCase().includes("devoir")
      );

      const efms = uniqueItems.filter(i => 
        i.title?.toLowerCase().includes("efm") || 
        i.title?.toLowerCase().includes("examen final") ||
        i.title?.toLowerCase().includes("examen de fin")
      );

      setResources({ courses, ccs, efms });
      setLoadingResources(false);
    };

    loadAllPossible();
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
        {items.map((item, i) => (
          <li key={item.id || i}>
            <a href={getFileUrl(item.file_path || item.path)} target="_blank" rel="noopener noreferrer" className="res-link">
              <span className="icon" style={{color}}>{icon}</span>
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
                    <div style={{background:"#22c55e", color:"white", padding:8, borderRadius:8, fontWeight:"bold", margin:"10px 0"}}>
                      ✓ {resources.courses.length} Cours • {resources.ccs.length} CC • {resources.efms.length} EFM
                    </div>

                    {loadingResources ? <div className="loader small"></div> : (
                      <>
                        <div className="res-group"><strong style={{color:"#8b5cf6"}}>📚 Cours ({resources.courses.length})</strong>{renderList(resources.courses, "cours", "📚", "#8b5cf6")}</div>
                        <div className="res-group"><strong style={{color:"#f59e0b"}}>📝 CC ({resources.ccs.length})</strong>{renderList(resources.ccs, "CC", "📝", "#f59e0b")}</div>
                        <div className="res-group"><strong style={{color:"#ec4899"}}>🎯 EFM ({resources.efms.length})</strong>{renderList(resources.efms, "EFM", "🎯", "#ec4899")}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-lg">
          <h2 className="section-title">EFF (Fin de Formation)</h2>
          {loadingEffs ? <div className="loader"></div> : effs.length === 0 ? 
            <p className="empty-box">Aucun EFF disponible</p> :
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
          }
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