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

  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ courses: [], ccs: [], efms: [] });
  const [loadingResources, setLoadingResources] = useState(false);
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  // Sécurité
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection", { replace: true });
    }
  }, [year, filiere, navigate]);

  // Chargement modules + EFF
  useEffect(() => {
    if (!filiere?.id) return;

    if (!preloadedModules?.length) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then(r => r.json())
        .then(d => d.success && setModules(d.data))
        .finally(() => setLoadingModules(false));
    }

    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then(r => r.json())
      .then(d => d.success && setEffs(d.data))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // LE CODE MAGIQUE QUI FAIT TOUT APPARAÎTRE (2025)
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);
    setResources({ courses: [], ccs: [], efms: [] });

    const loadResources = async () => {
      try {
        // 1. ON VA TOUT CHERCHER DANS /exams → C'EST LÀ QUE TOUT EST CACHÉ EN VRAI
        const examsRes = await fetch(`${API_BASE}/modules/${selectedModule.id}/exams`);
        const examsJson = await examsRes.json();

        let allExams = [];
        if (examsJson.success && Array.isArray(examsJson.data)) {
          allExams = examsJson.data;
        }

        // 2. Séparation intelligente CC vs EFM
        const ccs = allExams.filter(item =>
          (item.title?.toLowerCase().includes("cc") ||
           item.title?.toLowerCase().includes("contrôle") ||
           item.title?.toLowerCase().includes("ds") ||
           item.title?.toLowerCase().includes("devoir")) &&
          !item.title?.toLowerCase().includes("efm")
        );

        const efms = allExams.filter(item =>
          item.title?.toLowerCase().includes("efm") ||
          item.title?.toLowerCase().includes("examen de fin") ||
          item.title?.toLowerCase().includes("efm")
        );

        // 3. Cours à part
        const coursesRes = await fetch(`${API_BASE}/modules/${selectedModule.id}/courses`);
        const coursesJson = await coursesRes.json();
        const courses = coursesJson.success ? coursesJson.data : [];

        setResources({ courses, ccs, efms });

      } catch (err) {
        // Fallback au cas où (très rare)
        const [coursesJson, ccsJson, efmsJson] = await Promise.all([
          fetch(`${API_BASE}/modules/${selectedModule.id}/courses`).then(r => r.json()),
          fetch(`${API_BASE}/modules/${selectedModule.id}/ccs`).then(r => r.json()),
          fetch(`${API_BASE}/modules/${selectedModule.id}/module-exams`).then(r => r.json())
        ]);

        setResources({
          courses: coursesJson.success ? coursesJson.data : [],
          ccs: ccsJson.success ? ccsJson.data : [],
          efms: efmsJson.success ? efmsJson.data : []
        });
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, [selectedModule]);

  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${STORAGE_BASE}/${path.startsWith("/") ? path.slice(1) : path}`;
  };

  const renderList = (items, label, icon, color) => {
    if (!items?.length)
      return <div className="empty-msg">Aucun {label} disponible</div>;

    return (
      <ul className="res-list">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={getFileUrl(item.file_path || item.path)}
              target="_blank"
              rel="noopener noreferrer"
              className="res-link"
            >
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
        <div className="logo-container">
          <img src={logo} alt="Étudia" />
        </div>
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

                {/* DEBUG TEMPORAIRE (enlève après si tu veux) */}
                {selectedModule?.id === mod.id && (
                  <div style={{background:"#ef4444", color:"white", padding:8, borderRadius:8, fontSize:13, margin:"10px 0"}}>
                    {resources.ccs.length} CC • {resources.efms.length} EFM • {resources.courses.length} Cours
                  </div>
                )}

                {selectedModule?.id === mod.id && (
                  <div className="module-details">
                    {loadingResources ? (
                      <div className="loader small"></div>
                    ) : (
                      <>
                        <div className="res-group">
                          <strong style={{ color: "#8b5cf6" }}>📚 Cours</strong>
                          {renderList(resources.courses, "cours", "📚", "#8b5cf6")}
                        </div>

                        <div className="res-group">
                          <strong style={{ color: "#f59e0b" }}>📝 Contrôles Continus (CC)</strong>
                          {renderList(resources.ccs, "CC", "📝", "#f59e0b")}
                        </div>

                        <div className="res-group">
                          <strong style={{ color: "#ec4899" }}>🎯 EFM (Examen Final)</strong>
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
          <h2 className="section-title">Examens de Fin de Formation (EFF)</h2>
          {loadingEffs ? (
            <div className="loader"></div>
          ) : effs.length === 0 ? (
            <p className="empty-box">Aucun EFF disponible pour cette filière.</p>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div key={eff.id} className="module-card">
                  <h3>{eff.title || "EFF"}</h3>
                  {eff.year && <span className="badge badge-success">{eff.year}</span>}
                  <div className="mt-sm">
                    <a href={getFileUrl(eff.file_path)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      📥 Télécharger
                    </a>
                  </div>
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
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}