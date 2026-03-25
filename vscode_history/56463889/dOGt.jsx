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

  // Sécurité : redirection si pas de données
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection", { replace: true });
    }
  }, [year, filiere, navigate]);

  // Chargement des modules + EFF (fin de formation)
  useEffect(() => {
    if (!filiere?.id) return;

    // Modules
    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then(r => r.json())
        .then(d => { if (d.success) setModules(d.data); })
        .catch(() => setModules([]))
        .finally(() => setLoadingModules(false));
    }

    // EFF (Examens de Fin de Formation)
    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then(r => r.json())
      .then(d => { if (d.success) setEffs(d.data); })
      .catch(() => setEffs([]))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // Chargement des ressources du module sélectionné (Cours + CC + EFM)
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);
    setResources({ courses: [], ccs: [], efms: [] });

    const fetchSafe = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const json = await res.json();
        return json.success && Array.isArray(json.data) ? json.data : [];
      } catch (err) {
        console.error("Erreur API :", url, err);
        return [];
      }
    };

    Promise.all([
      fetchSafe(`${API_BASE}/modules/${selectedModule.id}/courses`),        // Cours
      fetchSafe(`${API_BASE}/modules/${selectedModule.id}/ccs`),            // Contrôles Continus
      fetchSafe(`${API_BASE}/modules/${selectedModule.id}/module-exams`),   // ← EFM (LE VRAI ENDPOINT)
    ])
      .then(([courses, ccs, efms]) => {
        setResources({ courses, ccs, efms });
      })
      .finally(() => setLoadingResources(false));
  }, [selectedModule]);

  // Gestion des liens fichiers
  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${STORAGE_BASE}/${cleanPath}`;
  };

  // Rendu des listes (cours, CC, EFM)
  const renderList = (items, label, icon, color = "#6366f1") => {
    if (!items || items.length === 0)
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
              <span className="icon" style={{ color }}>
                {icon}
              </span>
              {item.title || item.name || "Fichier sans titre"}
              {item.year && <span className="badge-primary ml-2">{item.year}</span>}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  // Protection finale (au cas où)
  if (!year || !filiere) return null;

  return (
    <div className="container">
      {/* Header */}
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

        {/* Modules */}
        <h2 className="section-title">Vos Modules</h2>
        {loadingModules ? (
          <div className="loader"></div>
        ) : (
          <div className="modules-grid">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                onClick={() =>
                  setSelectedModule(selectedModule?.id === mod.id ? null : mod)
                }
              >
                <h3>{mod.name}</h3>
                {mod.code && <span className="badge">{mod.code}</span>}

                {/* Détails du module */}
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
                          <strong style={{ color: "#f59e0b" }}>📝 Contrôles Continus</strong>
                          {renderList(resources.ccs, "CC", "📝", "#f59e0b")}
                        </div>

                        <div className="res-group">
                          <strong style={{ color: "#ec4899" }}>🎯 EFM</strong>
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

        {/* Examens de Fin de Formation (EFF) */}
        <div className="mt-lg">
          <h2 className="section-title">Examens de Fin de Formation (EFF)</h2>
          {loadingEffs ? (
            <div className="loader"></div>
          ) : effs.length === 0 ? (
            <p className="empty-box">Aucun EFF disponible pour le moment.</p>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div key={eff.id} className="module-card">
                  <h3>{eff.title || "EFF"}</h3>
                  {eff.year && <span className="badge badge-success">{eff.year}</span>}
                  <div className="mt-sm">
                    <a
                      href={getFileUrl(eff.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      📥 Télécharger le sujet
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn-back mt-lg" onClick={() => navigate("/selection")}>
          ← Retour au choix
        </button>
      </div>

      {/* Fond décoratif */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}