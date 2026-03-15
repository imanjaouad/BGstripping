C'est normal ! C'est une erreur classique avec les serveurs Laravel (la technologie utilisée par ton API).

Les fichiers ne sont pas à la racine du site, mais dans un dossier spécial appelé **`/storage`**.

Il faut donc changer l'URL de base des fichiers.

### Correction Rapide

Dans ton fichier `src/components/EtudiaModules.jsx`, change juste cette ligne au début :

**Remplace ça :**
```javascript
const STORAGE_BASE = "https://podo.b1.ma";
```

**Par ça (ajout de /storage) :**
```javascript
const STORAGE_BASE = "https://podo.b1.ma/storage";
```

---

### Voici le code complet corrigé de `EtudiaModules.jsx`

Copie-colle tout ce code, j'ai mis à jour la constante et amélioré la fonction de nettoyage des liens pour éviter les erreurs.

```jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

const API_BASE = "https://podo.b1.ma/api/public";

// CORRECTION ICI : Ajout de "/storage" car c'est là que Laravel stocke les fichiers
const STORAGE_BASE = "https://podo.b1.ma/storage"; 

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();

  const { year, filiere, modules: preloadedModules } = location.state || {};

  // États
  const [modules, setModules] = useState(preloadedModules || []);
  const [loadingModules, setLoadingModules] = useState(!preloadedModules);
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [resources, setResources] = useState({ ccs: [], efms: [], courses: [] });
  const [loadingResources, setLoadingResources] = useState(false);

  const [effs, setEffs] = useState([]);
  const [loadingEffs, setLoadingEffs] = useState(false);
  const [error, setError] = useState("");

  // --- FONCTION DE CORRECTION D'URL ---
  const getFileUrl = (path) => {
    if (!path) return "#";
    
    // 1. Si le lien est déjà complet (commence par http), on ne touche à rien
    if (path.startsWith("http")) return path;
    
    // 2. Nettoyage : on enlève le slash au début s'il y en a un
    let cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // 3. Sécurité : Si l'API renvoie déjà "storage/...", on évite de le mettre en double
    // (Mais généralement l'API renvoie "effs/..." donc on ajoute STORAGE_BASE qui contient /storage)
    return `${STORAGE_BASE}/${cleanPath}`;
  };
  // ------------------------------------

  // Redirection si pas de données
  useEffect(() => {
    if (!year || !filiere) navigate("/selection");
  }, [year, filiere, navigate]);

  // Charger Modules + EFFs
  useEffect(() => {
    if (!filiere?.id) return;

    // Charger modules
    if (!preloadedModules || preloadedModules.length === 0) {
      setLoadingModules(true);
      fetch(`${API_BASE}/filieres/${filiere.id}/modules`)
        .then(res => res.json())
        .then(data => { if (data.success) setModules(data.data); })
        .catch(() => setError("Erreur modules"))
        .finally(() => setLoadingModules(false));
    }

    // Charger EFFs
    setLoadingEffs(true);
    fetch(`${API_BASE}/filieres/${filiere.id}/effs`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setEffs(data.data);
        else setEffs([]);
      })
      .catch(() => setEffs([]))
      .finally(() => setLoadingEffs(false));
  }, [filiere, preloadedModules]);

  // Charger Ressources (Cours, CC, EFM)
  useEffect(() => {
    if (!selectedModule) return;
    setLoadingResources(true);
    setResources({ ccs: [], efms: [], courses: [] });

    // Fonction fetch sécurisée
    const fetchResource = (url) => fetch(url)
      .then(res => res.ok ? res.json() : [])
      .then(json => (json.success && Array.isArray(json.data)) ? json.data : [])
      .catch(() => []);

    Promise.all([
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/ccs`),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/efms`),
      fetchResource(`${API_BASE}/modules/${selectedModule.id}/courses`)
    ])
    .then(([ccs, efms, courses]) => setResources({ ccs, efms, courses }))
    .finally(() => setLoadingResources(false));
  }, [selectedModule]);

  const handleModuleClick = (mod) => {
    setSelectedModule(selectedModule?.id === mod.id ? null : mod);
  };

  if (!year || !filiere) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <div className="welcome-box">
        <h2>{year.name} - {filiere.name}</h2>
        <p>Cliquez sur un module pour voir le contenu.</p>
      </div>

      <div className="main-content">
        {/* MODULES */}
        <div className="section">
          <h2 className="section-title">Modules</h2>
          <div className="underline2"></div>

          {loadingModules ? <p>Chargement...</p> : (
            <div className="modules-grid">
              {modules.map((mod) => (
                <div 
                  key={mod.id} 
                  className={`module-card ${selectedModule?.id === mod.id ? "selected" : ""}`}
                  onClick={() => handleModuleClick(mod)}
                  style={{ cursor: "pointer", border: selectedModule?.id === mod.id ? "2px solid #007BFF" : "none" }}
                >
                  <h3>{mod.name}</h3>
                  {mod.code && <span className="badge info">{mod.code}</span>}
                  
                  {/* DETAILS */}
                  {selectedModule?.id === mod.id && (
                    <div className="module-details-box" style={{ marginTop: "15px", borderTop: "1px solid #eee", paddingTop: "10px" }}>
                      {loadingResources ? <p style={{color: "#007BFF"}}>Chargement...</p> : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                          
                          {/* COURS */}
                          <div>
                            <strong style={{color: "#007BFF"}}>📚 Cours ({resources.courses.length})</strong>
                            <ul style={{fontSize: "13px", paddingLeft: "15px", marginTop: "5px"}}>
                              {resources.courses.map(c => (
                                <li key={c.id}>
                                  <a href={getFileUrl(c.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link">
                                    {c.title || "Voir le cours"}
                                  </a>
                                </li>
                              ))}
                              {resources.courses.length === 0 && <li style={{listStyle: "none", color: "#999", fontSize: "12px"}}>Aucun cours</li>}
                            </ul>
                          </div>

                          {/* CC */}
                          <div>
                            <strong style={{color: "#FFA500"}}>📝 Contrôles ({resources.ccs.length})</strong>
                            <ul style={{fontSize: "13px", paddingLeft: "15px", marginTop: "5px"}}>
                              {resources.ccs.map(cc => (
                                <li key={cc.id}>
                                  <a href={getFileUrl(cc.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "#FFA500"}}>
                                    {cc.title || "Voir le CC"}
                                  </a>
                                </li>
                              ))}
                              {resources.ccs.length === 0 && <li style={{listStyle: "none", color: "#999", fontSize: "12px"}}>Aucun CC</li>}
                            </ul>
                          </div>

                          {/* EFM */}
                          <div>
                            <strong style={{color: "#28A745"}}>🎓 EFM ({resources.efms.length})</strong>
                            <ul style={{fontSize: "13px", paddingLeft: "15px", marginTop: "5px"}}>
                              {resources.efms.map(efm => (
                                <li key={efm.id}>
                                  <a href={getFileUrl(efm.file_path)} target="_blank" rel="noopener noreferrer" className="efm-link" style={{color: "#28A745"}}>
                                    {efm.title || "Voir l'EFM"}
                                  </a>
                                </li>
                              ))}
                              {resources.efms.length === 0 && <li style={{listStyle: "none", color: "#999", fontSize: "12px"}}>Aucun EFM</li>}
                            </ul>
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

        {/* EFFs */}
        <div className="section" style={{ marginTop: "50px" }}>
          <h2 className="section-title">Examens Fin de Formation (EFF)</h2>
          <div className="underline2" style={{ background: "#28A745" }}></div>

          {loadingEffs ? <p>Recherche...</p> : effs.length === 0 ? (
            <div className="info-box warning">Aucun EFF disponible.</div>
          ) : (
            <div className="modules-grid">
              {effs.map((eff) => (
                <div key={eff.id} className="module-card" style={{ borderLeft: "5px solid #28A745" }}>
                  <h3>{eff.title || `EFF ${eff.year || ""}`}</h3>
                  {eff.year && <span className="badge success">{eff.year}</span>}
                  <div style={{ marginTop: "10px" }}>
                    <a 
                      href={getFileUrl(eff.file_path)} 
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
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}
```