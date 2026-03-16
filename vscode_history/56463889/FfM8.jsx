// src/components/EtudiaModules.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";
const STORAGE_BASE = "https://podo.b1.ma/storage";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const { year, filiere, modules: preloadedModules } = stateData;

  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({
    ccs: [],
    efms: [],
    courses: [],
  });
  const [loadingResources, setLoadingResources] = useState(false);
  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);

  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${STORAGE_BASE}/${clean}`;
  };

  // Sécurité : si on arrive sans state, on renvoie à la sélection
  useEffect(() => {
    if (!year || !filiere) {
      navigate("/selection", { replace: true });
    }
  }, [year, filiere, navigate]);

  // Charger modules + EFF
  useEffect(() => {
    if (!filiere?.id) return;

    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.data) setModules(d.data);
        })
        .catch(() => {})
        .finally(() => setLoadingModules(false));
    }

    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) setEffs(d.data);
        else setEffs([]);
      })
      .catch(() => setEffs([]))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // Charger les ressources d’un module
  useEffect(() => {
    if (!selectedModule) return;
    setLoadingResources(true);
    setResources({ ccs: [], efms: [], courses: [] });

    const fetchRes = (url) =>
      fetch(url)
        .then((r) => (r.ok ? r.json() : []))
        .then((j) =>
          j && j.success && Array.isArray(j.data) ? j.data : Array.isArray(j) ? j : []
        )
        .catch(() => []);

    Promise.all([
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/ccs`),
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/efms`),
      fetchRes(`${API_BASE}/modules/${selectedModule.id}/courses`),
    ])
      .then(([ccs, efms, courses]) => setResources({ ccs, efms, courses }))
      .finally(() => setLoadingResources(false));
  }, [selectedModule]);

  const renderList = (items, label, icon) => {
    if (!items || items.length === 0) {
      return <div className="empty-msg">Aucun {label} disponible.</div>;
    }
    return (
      <ul className="res-list">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={getFileUrl(it.file_path)}
              target="_blank"
              rel="noopener noreferrer"
              className="res-link"
            >
              <span className="icon">{icon}</span>
              {it.title || it.name || `Voir ${label}`}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  if (!year || !filiere) return null;

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <div className="main-content">
        {/* Bloc d’en-tête “dashboard” */}
        <div className="modules-header-box">
          <div className="modules-header-left">
            <span className="tag">Espace modules</span>
            <h2 className="modules-title">
              {filiere.name} – <span>{year.name}</span>
            </h2>
            <p className="modules-subtitle">
              Consulte tes modules, télécharge tes cours et révise en accédant
              facilement aux CC, EFM et EFF de ta filière.
            </p>
          </div>
          <div className="modules-header-right">
            <div className="chip">
              <span className="chip-label">Modules</span>
              <span className="chip-value">{modules.length}</span>
            </div>
            <div className="chip">
              <span className="chip-label">EFF</span>
              <span className="chip-value">{effs.length}</span>
            </div>
          </div>
        </div>

        {/* Liste des modules */}
        <div className="section">
          <h3 className="section-title">Modules de la filière</h3>
          {loadingModules ? (
            <div className="loader" />
          ) : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  className={`module-card ${
                    selectedModule?.id === mod.id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedModule(
                      selectedModule?.id === mod.id ? null : mod
                    )
                  }
                >
                  <h3>{mod.name}</h3>
                  {mod.code && <span className="badge">{mod.code}</span>}
                  {/* Détails du module */}
                  {selectedModule?.id === mod.id && (
                    <div className="module-details">
                      {loadingResources ? (
                        <div className="loader small" />
                      ) : (
                        <>
                          <div className="res-group">
                            <strong>Cours</strong>
                            {renderList(
                              resources.courses,
                              "cours",
                              "📚"
                            )}
                          </div>
                          <div className="res-group">
                            <strong>Contrôles (CC)</strong>
                            {renderList(resources.ccs, "contrôle", "📝")}
                          </div>
                          <div className="res-group">
                            <strong>EFM</strong>
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
        </div>

        {/* EFF de la filière */}
        <div className="section" style={{ marginTop: 40 }}>
          <h3 className="section-title">Examens de fin de formation (EFF)</h3>
          {loadingEffs ? (
            <div className="loader" />
          ) : effs.length === 0 ? (
            <div className="empty-box">
              Aucun EFF disponible pour cette filière pour le moment.
            </div>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div
                  key={eff.id}
                  className="module-card"
                  style={{ borderLeft: "5px solid #10B981" }}
                >
                  <h3>{eff.title || "Sujet EFF"}</h3>
                  {eff.year && (
                    <span className="badge success">{eff.year}</span>
                  )}
                  <div style={{ marginTop: 16 }}>
                    <a
                      href={getFileUrl(eff.file_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-download"
                    >
                      📥 Télécharger le sujet
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton retour */}
        <button className="btn-back" onClick={() => navigate("/selection")}>
          ← Retour à la sélection
        </button>
      </div>

      {/* Décor */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle" />
        ))}
      </div>
    </div>
  );
}