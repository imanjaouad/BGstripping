import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state;
  
  // Rediriger si pas de sélection
  if (!selection || !selection.filiere_id) {
    navigate('/selection');
    return null;
  }

  const { filiere_id, year, filiere } = selection;
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
    setLoading(true);
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API modules");
        return res.json();
      })
      .then((json) => {
        const modulesData = json.data || json.modules || [];
        setModules(modulesData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filiere_id]);

  // Charger les EFFs de la filière
  useEffect(() => {
    fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`)
      .then((res) => res.json())
      .then((json) => {
        const effsData = json.data || json.effs || [];
        setModuleContent(prev => ({
          ...prev,
          effs: effsData
        }));
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
        ccs: ccsData.data || ccsData.ccs || [],
        efms: efmsData.data || efmsData.efms || [],
        courses: coursesData.data || coursesData.courses || []
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

  const handleBackToSelection = () => {
    navigate('/selection');
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

      {/* Bouton retour */}
      <button 
        className="back-button" 
        onClick={handleBackToSelection}
      >
        ← Retour à la sélection
      </button>

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
          Modules - {year?.name || year?.year_name}
        </h2>
        <p className="filiere-info">Filière: {filiere?.name || filiere?.filiere_name}</p>

        {loading && <p className="loading-text">Chargement des modules...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && modules.length === 0 && <p>Aucun module trouvé.</p>}

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
                <h3>{m.name || m.module_name}</h3>
                <span className="module-code">{m.code || m.module_code}</span>
              </div>
              <p>Crédits: {m.credits || 0} | Heures: {m.total_hours || m.hours || 0}h</p>
              {m.instructor && <p>Professeur: {m.instructor}</p>}
              <button className="select-module-btn">
                {moduleSelectionne?.id === m.id ? "Sélectionné" : "Choisir"}
              </button>
            </div>
          ))}
        </div>

        {/* Contenu du module sélectionné */}
        {moduleSelectionne && (
          <div className="module-details">
            <h3>{moduleSelectionne.name || moduleSelectionne.module_name} - Contenu</h3>
            
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
                <p className="loading-text">Chargement du contenu...</p>
              ) : (
                <>
                  {activeTab === 'courses' && (
                    <div className="content-list">
                      {moduleContent.courses.length === 0 ? (
                        <p>Aucun cours disponible</p>
                      ) : (
                        moduleContent.courses.map((course) => (
                          <div key={course.id} className="content-item">
                            <h4>{course.title || course.course_title}</h4>
                            {course.description && <p>{course.description}</p>}
                            {course.file_path && (
                              <a 
                                href={course.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="download-link"
                              >
                                Télécharger
                              </a>
                            )}
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
                            <h4>CC - {cc.title || cc.cc_title}</h4>
                            {cc.description && <p>{cc.description}</p>}
                            {cc.date && <p className="date">Date: {cc.date}</p>}
                            {cc.file_path && (
                              <a 
                                href={cc.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="download-link"
                              >
                                Télécharger
                              </a>
                            )}
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
                            <h4>EFM - {efm.title || efm.efm_title}</h4>
                            {efm.description && <p>{efm.description}</p>}
                            {efm.date && <p className="date">Date: {efm.date}</p>}
                            {efm.file_path && (
                              <a 
                                href={efm.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="download-link"
                              >
                                Télécharger
                              </a>
                            )}
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
                            <h4>EFF - {eff.title || eff.eff_title}</h4>
                            {eff.description && <p>{eff.description}</p>}
                            {eff.date && <p className="date">Date: {eff.date}</p>}
                            {eff.file_path && (
                              <a 
                                href={eff.file_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="download-link"
                              >
                                Télécharger
                              </a>
                            )}
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