import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

// Fonction pour nettoyer les URLs
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
  
  // États
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modale et contenu
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  const [effs, setEffs] = useState([]); 
  const [moduleContent, setModuleContent] = useState({ 
    ccs: [], efms: [], courses: [] 
  });
  
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // IDs
  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    if (!filiere_id) {
      navigate('/selection'); 
      return;
    }

    setLoading(true);
    
    const fetchModules = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`).then(r => r.json());
    const fetchEFFs = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`).then(r => r.json());

    Promise.all([fetchModules, fetchEFFs])
      .then(([modData, effData]) => {
        // On récupère exactement ce que l'API donne, sans rien ajouter
        setModules(modData.data || modData.modules || []);
        setEffs(effData.data || effData.effs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erreur de chargement.");
        setLoading(false);
      });
  }, [filiere_id, navigate]);

  // --- GESTION SCROLL & ECHAP ---
  useEffect(() => {
    if (moduleSelectionne) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    const handleEsc = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [moduleSelectionne]);
    <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h2 className="title" style={{fontSize: '2rem', marginBottom: '10px'}}>Le parcours ...</h2>
          <p style={{color: '#666'}}>Veuillez sélectionner votre parcours.</p>
        </div>
  // --- CLIC MODULE ---
  const handleModuleClick = async (module) => {
    if (!module?.id) return;

    setModuleSelectionne(module);
    setContentLoading(true);
    setActiveTab('courses');
    setModuleContent({ ccs: [], efms: [], courses: [] });

    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/ccs`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/efms`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/courses`)
      ]);

      const [d1, d2, d3] = await Promise.all([r1.json(), r2.json(), r3.json()]);

      setModuleContent({
        ccs: d1.data || d1.ccs || [],
        efms: d2.data || d2.efms || [],
        courses: d3.data || d3.courses || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  const closeModal = () => {
    setModuleSelectionne(null);
  };

  if (!filiere_id) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/selection')}>
        ← Retour aux filières
      </button>

      <div className="main-content">
        <h2 className="section-title">
           Modules <span style={{fontSize:'0.6em', color:'#666', fontWeight:'normal'}}>({year?.name || year?.year_name})</span>
        </h2>
        <p className="filiere-info">{filiere?.name || filiere?.filiere_name}</p>

        {loading && <p className="loading-text">Chargement...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && modules.length === 0 && (
            <div className="empty-state">
                <div style={{fontSize: '50px', marginBottom: '15px'}}>📭</div>
                <h3>Aucun module trouvé</h3>
                <p>Cette filière ne contient pas encore de modules.</p>
            </div>
        )}

        {/* --- GRILLE DES MODULES --- */}
        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className="module-card"
              onClick={() => handleModuleClick(m)}
            >
              <div className="module-header">
                <h3>{m.name || m.module_name}</h3>
                {/* Affiche le code SEULEMENT s'il existe dans l'API */}
                {(m.code || m.module_code) && (
                   <span className="module-code">{m.code || m.module_code}</span>
                )}
              </div>
              
              {/* Affiche la description SEULEMENT si elle existe dans l'API */}
              {m.description && (
                <p style={{fontSize: '0.9rem', color: '#666', margin: '10px 0'}}>
                  {m.description}
                </p>
              )}

              {/* Je n'affiche RIEN d'autre ici (pas de crédits, pas d'heures inventées) */}

              <button className="select-module-btn">Ouvrir</button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE --- */}
      {moduleSelectionne && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>{moduleSelectionne.name || moduleSelectionne.module_name}</h3>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="tabs">
                <TabButton name="Cours" count={moduleContent.courses.length} active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                <TabButton name="CC" count={moduleContent.ccs.length} active={activeTab === 'ccs'} onClick={() => setActiveTab('ccs')} />
                <TabButton name="EFM" count={moduleContent.efms.length} active={activeTab === 'efms'} onClick={() => setActiveTab('efms')} />
                <TabButton name="EFF" count={effs.length} active={activeTab === 'effs'} onClick={() => setActiveTab('effs')} />
              </div>

              <div className="tab-content">
                {contentLoading ? (
                  <div className="loading-text">Chargement du contenu...</div>
                ) : (
                  <>
                    {activeTab === 'courses' && <ListContent items={moduleContent.courses} type="Cours" />}
                    {activeTab === 'ccs' && <ListContent items={moduleContent.ccs} type="CC" />}
                    {activeTab === 'efms' && <ListContent items={moduleContent.efms} type="EFM" />}
                    {activeTab === 'effs' && <ListContent items={effs} type="EFF" />}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

            {/* DÉCORATION (Plus de triangles !) */}
      <div className="triangles-container">
        {[...Array(25)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div> // Fin du return
  );
}

// --- SOUS-COMPOSANTS ---
const TabButton = ({ name, count, active, onClick }) => (
  <button className={active ? 'active' : ''} onClick={onClick}>
    {name} {count > 0 && <span className="badge">({count})</span>}
  </button>
);

function ListContent({ items, type }) {
  if (!items || items.length === 0) return <p className="empty-msg" style={{textAlign:'center', color:'#888', padding:'20px'}}>Aucun document "{type}" disponible.</p>;
  return (
    <div className="content-list">
      {items.map((item) => <ContentItem key={item.id} type={type} item={item} />)}
    </div>
  );
}

function ContentItem({ item, type }) {
  const fileUrl = getFullFileUrl(item.file_path);
  return (
    <div className="content-item">
      <div className="content-info">
        <h4>{type} - {item.title || item.name || item.cc_title || item.efm_title || item.course_title || "Document"}</h4>
        {item.description && <p>{item.description}</p>}
        {item.date && <small>Date: {item.date}</small>}
      </div>
      
      {item.file_path ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">
          📥 Télécharger
        </a>
      ) : (
        <span className="no-link" style={{fontSize:'12px', color:'red'}}>Lien indisponible</span>
      )}
    </div>
  );
}