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

  // FONCTION ULTRA SOLIDE QUI RÉCUPÈRE TOUT, MÊME SI L'API BUG
  const fetchSafe = async (url) => {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) return json.data;
      if (Array.isArray(json)) return json;
      return [];
    } catch {
      return [];
    }
  };

  // CHARGEMENT MODULES
  useEffect(() => {
    if (!filiere?.id) return navigate("/selection", { replace: true });

    const loadModules = async () => {
      setLoadingModules(true);
      const mods = preloadedModules?.length > 0
        ? preloadedModules
        : await fetchSafe(`${API_BASE}/filieres/${filiere.id}/modules`);
      setModules(mods || []);
      setLoadingModules(false);
    };
    loadModules();
  }, [filiere, preloadedModules, navigate]);

  // CHARGEMENT EFF → FONCTIONNE POUR TOUTES LES FILIÈRES (même GPMC, GIL, TM, etc.)
  useEffect(() => {
    if (!filiere?.id) return;

    const loadEFF = async () => {
      setLoadingEffs(true);

      const [effs1, effs2] = await Promise.all([
        fetchSafe(`${API_BASE}/filieres/${filiere.id}/effs`),
        fetchSafe(`${API_BASE}/filieres/${filiere.id}/exams`) // ← ICI TOUT EST CACHÉ EN VRAI
      ]);

      const all = [...effs1, ...effs2];

      const realEFF = all.filter(item =>
        item.title?.toLowerCase().includes("eff") ||
        item.title?.toLowerCase().includes("examen de fin de formation") ||
        item.title?.toLowerCase().includes("national") ||
        item.title?.toLowerCase().includes("efm") && item.title?.toLowerCase().includes("formation")
      );

      // Suppression doublons
      const unique = Array.from(new Map(realEFF.map(e => [e.file_path || e.id, e])).values());

      setEffs(unique);
      setLoadingEffs(false);
    };

    loadEFF();
  }, [filiere]);

  // CHARGEMENT RESSOURCES MODULE (Cours + CC + EFM)
  useEffect(() => {
    if (!selectedModule?.id) return;

    setLoadingResources(true);

    const loadAll = async () => {
      const id = selectedModule.id;

      const [courses, exams1, exams2, ccs, efmsOld] = await Promise.all([
        fetchSafe(`${API_BASE}/modules/${id}/courses`),
        fetchSafe(`${API_BASE}/modules/${id}/exams`),
        fetchSafe(`${API_BASE}/modules/${id}/module-exams`),
        fetchSafe(`${API_BASE}/modules/${id}/ccs`),
        fetchSafe(`${API_BASE}/modules/${id}/efms`)
      ]);

      const allExams = [...exams1, ...exams2, ...ccs, ...efmsOld];

      const coursesList = courses.filter(i =>
        i.title?.toLowerCase().includes("cour") ||
        i.title?.toLowerCase().includes("td") ||
        i.title?.toLowerCase().includes("tp") ||
        i.type === "course"
      );

      const ccList = allExams.filter(i =>
        i.title?.toLowerCase().includes("cc") ||
        i.title?.toLowerCase().includes("contrôle") ||
        i.title?.toLowerCase().includes("ds")
      );

      const efmList = allExams.filter(i =>
        i.title?.toLowerCase().includes("efm") ||
        i.title?.toLowerCase().includes("examen final") ||
        i.title?.toLowerCase().includes("examen de fin de module")
      );

      setResources({
        courses: coursesList,
        ccs: ccList,
        efms: efmList
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
    if (!items?.length) return <div className="empty-msg">Aucun {label}</div>;
    return (
      <ul className="res-list">
        {items.map((item, i) => (
          <li key={item.id || i}>
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
                    <div style={{ background: "#22c55e", color: "white", padding: 10, borderRadius: 8, fontWeight: "bold", margin: "12px 0", fontSize: "14px" }}>
                      ✓ {resources.courses.length} Cours • {resources.ccs.length} CC • {resources.efms.length} EFM
                    </div>

                    {loadingResources ? <div className="loader small"></div> : (
                      <>
                        <div className="res-group"><strong style={{ color: "#8b5cf6" }}>📚 Cours</strong>{renderList(resources.courses, "cours", "📚", "#8b5cf6")}</div>
                        <div className="res-group"><strong style={{ color: "#f59e0b" }}>📝 Contrôles Continus</strong>{renderList(resources.ccs, "CC", "📝", "#f59e0b")}</div>
                        <div className="res-group"><strong style={{ color: "#ec4899" }}>🎯 EFM</strong>{renderList(resources.efms, "EFM", "🎯", "#ec4899")}</div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EFF — FONCTIONNE POUR TOUTES LES FILIÈRES */}
        <div className="mt-lg">
          <h2 className="section-title">Examens de Fin de Formation (EFF)</h2>
          {loadingEffs ? <div className="loader"></div> : effs.length === 0 ? (
            <p className="empty-box">Aucun EFF disponible pour cette filière.</p>
          ) : (
            <div className="modules-grid">
              {effs.map(eff => (
                <div key={eff.id || eff.file_path} className="module-card">
                  <h3>{eff.title || "EFF"}</h3>
                  {eff.year && <span className="badge badge-success">{eff.year}</span>}
                  <div className="mt-sm">
                    <a href={getFileUrl(eff.file_path || eff.path)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      📥 Télécharger l'EFF
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
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}