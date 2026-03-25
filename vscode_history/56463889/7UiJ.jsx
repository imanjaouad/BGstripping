import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

// --- FONCTION UTILITAIRE URL (Gardée de l'étape précédente) ---
const getFullFileUrl = (path) => {
  if (!path) return "#";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `https://podo.b1.ma/storage/${cleanPath}`;
};

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state;
  
  // --- ETATS ---
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  
  const [effs, setEffs] = useState([]); 
  const [moduleContent, setModuleContent] = useState({ 
    ccs: [], efms: [], courses: [] 
  });
  
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // --- IDs ---
  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- EFFETS ---
  useEffect(() => {
    if (!filiere_id) {
      navigate('/selection');
      return;
    }

    setLoading(true);
    const fetchModules = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`).then(res => res.json());
    const fetchEFFs = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`).then(res => res.json());

    Promise.all([fetchModules, fetchEFFs])
      .then(([modulesData, effsData]) => {
        setModules(modulesData.data || modulesData.modules || []);
        setEffs(effsData.data || effsData.effs || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Erreur chargement.");
        setLoading(false);
      });
  }, [filiere_id, navigate]);

  // --- FONCTIONS ---
  const handleModuleClick = async (module) => {
    if (!module || !module.id) return;

    setModuleSelectionne(module); // Ouvre la modale
    setContentLoading(true);
    // On remet l'onglet par défaut sur Cours
    setActiveTab('courses');
    setModuleContent({ ccs: [], efms: [], courses: [] });

    try {
      const [ccsRes, efmsRes, coursesRes] = await Promise.all([
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/ccs`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/efms`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/courses`)
      ]);

      const [ccsData, efmsData, coursesData] = await Promise.all([
        ccsRes.json(), efmsRes.json(), coursesRes.json()
      ]);

      setModuleContent({
        ccs: ccsData.data || ccsData.ccs || [],
        efms: efmsData.data || efmsData.efms || [],
        courses: coursesData.data || coursesData.courses || []
      });

    } catch (err) {
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  // Nouvelle fonction pour fermer la modale
  const closeModal = () => {
    setModuleSelectionne(null);
  };

  if (!filiere_id) return null;

  return (
    <div className="container">
      {/* --- HEADER --- */}
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/selection')}>
        ← Retour
      </button>

      {/* --- LISTE DES MODULES --- */}
      <div className="main-content">
        <h2 className="section-title">Modules - {year?.name}</h2>
        <p className="filiere-info">{filiere?.name}</p>

        {loading && <p className="loading-text">Chargement...</p>}
        {error && <p className="error-message">{error}</p>}
        
        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className="module-card" // On enlève la classe "selected" car plus besoin
              onClick={() => handleModuleClick(m)}
            >
              <div className="module-header">
                <h3>{m.name}</h3>
                <span className="module-code">{m.code}</span>
              </div>
              <p>{m.total_hours || m.hours}h | {m.credits || 0} Crédits</p>
              <button className="select-module-btn">Ouvrir</button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE (POP-UP) --- */}
      {/* S'affiche uniquement si un module est sélectionné */}
      {moduleSelectionne && (
        <div className="modal-overlay" onClick={closeModal}>
          {/* onClick sur overlay ferme la modale, stopPropagation empêche de fermer si on clique DANS la boîte */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Modale */}
            <div className="modal-header">
              <h3>{moduleSelectionne.name}</h3>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>

            {/* Corps Modale (Scrollable) */}
            <div className="modal-body">
              
              {/* Onglets */}
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
                  EFF ({effs.length})
                </button>
              </div>

              {/* Contenu Onglets */}
              <div className="tab-content">
                {contentLoading ? (
                  <div className="loading-text" style={{padding: '50px'}}>Chargement du contenu...</div>
                ) : (
                  <>
                    {activeTab === 'courses' && (
                      <ListContent items={moduleContent.courses} type="Cours" />
                    )}
                    {activeTab === 'ccs' && (
                      <ListContent items={moduleContent.ccs} type="CC" />
                    )}
                    {activeTab === 'efms' && (
                      <ListContent items={moduleContent.efms} type="EFM" />
                    )}
                    {activeTab === 'effs' && (
                      <div className="content-list">
                         <p style={{fontSize:'12px', color:'#666', marginBottom:'10px'}}>
                           Les EFF sont communs à toute la filière.
                         </p>
                         <ListContent items={effs} type="EFF" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div> {/* Fin modal-body */}
          </div> {/* Fin modal-content */}
        </div> /* Fin modal-overlay */
      )}

      {/* Déco */}
      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS POUR ALLEGER LE CODE ---

// Affiche la liste ou un message vide
function ListContent({ items, type }) {
  if (!items || items.length === 0) return <p>Aucun {type} disponible.</p>;
  return (
    <div className="content-list">
      {items.map((item) => (
        <ContentItem key={item.id} type={type} item={item} />
      ))}
    </div>
  );
}

// Affiche un item individuel
function ContentItem({ item, type }) {
  const fileUrl = getFullFileUrl(item.file_path);
  return (
    <div className="content-item">
      <h4>{type} - {item.title || item.name || "Document"}</h4>
      {item.description && <p>{item.description}</p>}
      {item.date && <p className="date">Date: {item.date}</p>}
      
      {item.file_path ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
          Télécharger 📥
        </a>
      ) : (
        <span style={{color:'red', fontSize:'12px'}}>Lien indisponible</span>
      )}
    </div>
  );
}