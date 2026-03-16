import React, { useState, useEffect } from "react";
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules({ selection }) {
  const { filiere_id, year, filiere } = selection || {};
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  const [moduleContent, setModuleContent] = useState({
    ccs: [],
    efms: [],
    courses: [],
    effs: []
  });
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // Charger les modules
  useEffect(() => {
    if (!filiere_id) return;

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API modules");
        return res.json();
      })
      .then((json) => {
        if (json.success) {
          setModules(json.data || []);
        } else {
          setError("Modules introuvables");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filiere_id]);

  // Charger les EFFs de la filière
  useEffect(() => {
    if (!filiere_id) return;

    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setModuleContent(prev => ({
            ...prev,
            effs: json.data || []
          }));
        }
      })
      .catch((err) => console.error("Erreur chargement EFFs:", err));
  }, [filiere_id]);

  // Charger le contenu du module sélectionné
  const loadModuleContent = async (moduleId) => {
    setContentLoading(true);
    
    try {
      const [ccsRes, efmsRes, coursesRes] = await Promise.all([
        fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/ccs`),
        fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/efms`),
        fetch(`https://podo.b1.ma/api/public/modules/${moduleId}/courses`)
      ]);

      const [ccsData, efmsData, coursesData] = await Promise.all([
        ccsRes.json(),
        efmsRes.json(),
        coursesRes.json()
      ]);

      setModuleContent(prev => ({
        ...prev,
        ccs: ccsData.data || [],
        efms: efmsData.data || [],
        courses: coursesData.data || []
      }));
    } catch (err) {
      console.error("Erreur chargement contenu module:", err);
    } finally {
      setContentLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    setModuleSelectionne(module);
    loadModuleContent(module.id);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      {/* WELCOME BOX */}
      <div className="welcome-box">
        <h2>Bienvenue sur votre espace modules ! 📚</h2>
        <p>
          Ici, vous pouvez consulter tous vos modules, accéder aux cours, CC, EFM et EFF.
        </p>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="section-title">
          Modules - {year?.name}
        </h2>
        {filiere && <p className="filiere-info">Filière: {filiere.name}</p>}

        {loading && <p>Chargement des modules...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`module-card ${
                moduleSelectionne?.id === m.id ? "selected" : ""
              }`}
              onClick={() => handleModuleClick(m)}
            >
              <div className="module-header">
                <h3>{m.name}</h3>
                <span className="module-code">{m.code}</span>
              </div>
              <p>Crédits: {m.credits} | Heures: {m.total_hours}</p>
              <p>Professeur: {m.instructor}</p>
              <button className="select-module-btn">
                {moduleSelectionne?.id === m.id ? "Sélectionné" : "Choisir"}
              </button>
            </div>
          ))}
        </div>

        {/* Contenu du module sélectionné */}
        {moduleSelectionne && (
          <div className="module-details">
            <h3>{moduleSelectionne.name} - Contenu</h3>
            
            {/* Tabs */}
            <div className="tabs">
              <button 
                className={activeTab === 'courses' ? 'active' : ''}
                onClick={() => setActiveTab('courses')}
              >
                Cours ({moduleContent.courses.length})
              </button>
              <button 
                className={activeTab === 'ccs' ? 'active' : ''}
                onClick={() => setActiveTab('ccs')}
              >
                CC ({moduleContent.ccs.length})
              </button>
              <button 
                className={activeTab === 'efms' ? 'active' : ''}
                onClick={() => setActiveTab('efms')}
              >
                EFM ({moduleContent.efms.length})
              </button>
              <button 
                className={activeTab === 'effs' ? 'active' : ''}
                onClick={() => setActiveTab('effs')}
              >
                EFF ({moduleContent.effs.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {contentLoading ? (
                <p>Chargement du contenu...</p>
              ) : (
                <>
                  {activeTab === 'courses' && (
                    <div className="content-list">
                      {moduleContent.courses.length === 0 ? (
                        <p>Aucun cours disponible</p>
                      ) : (
                        moduleContent.courses.map((course) => (
                          <div key={course.id} className="content-item">
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>
                            <a 
                              href={course.file_path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="download-link"
                            >
                              Télécharger
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'ccs' && (
                    <div className="content-list">
                      {moduleContent.ccs.length === 0 ? (
                        <p>Aucun CC disponible</p>
                      ) : (
                        moduleContent.ccs.map((cc) => (
                          <div key={cc.id} className="content-item">
                            <h4>CC - {cc.title}</h4>
                            <p>{cc.description}</p>
                            <p className="date">Date: {cc.date}</p>
                            <a 
                              href={cc.file_path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="download-link"
                            >
                              Télécharger
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'efms' && (
                    <div className="content-list">
                      {moduleContent.efms.length === 0 ? (
                        <p>Aucun EFM disponible</p>
                      ) : (
                        moduleContent.efms.map((efm) => (
                          <div key={efm.id} className="content-item">
                            <h4>EFM - {efm.title}</h4>
                            <p>{efm.description}</p>
                            <p className="date">Date: {efm.date}</p>
                            <a 
                              href={efm.file_path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="download-link"
                            >
                              Télécharger
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'effs' && (
                    <div className="content-list">
                      {moduleContent.effs.length === 0 ? (
                        <p>Aucun EFF disponible</p>
                      ) : (
                        moduleContent.effs.map((eff) => (
                          <div key={eff.id} className="content-item">
                            <h4>EFF - {eff.title}</h4>
                            <p>{eff.description}</p>
                            <p className="date">Date: {eff.date}</p>
                            <a 
                              href={eff.file_path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="download-link"
                            >
                              Télécharger
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Triangles en bas */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="triangle"></div>
        ))}
      </div>
    </div>
  );
}