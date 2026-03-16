import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

// --- UTILITAIRE : Correction des liens fichiers ---
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
  
  // --- ÉTATS ---
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États de la Modale (Pop-up)
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // --- DONNÉES ---
  // 1. EFFs : Liés à la FILIÈRE (récupérés au chargement)
  const [effs, setEffs] = useState([]); 
  
  // 2. Contenu Module : Lié au MODULE (récupéré au clic)
  const [moduleContent, setModuleContent] = useState({ 
    ccs: [], 
    efms: [], 
    courses: [] 
  });

  // Identifiants
  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- 1. CHARGEMENT INITIAL (Modules + EFF de la filière) ---
  useEffect(() => {
    if (!filiere_id) {
      navigate('/selection'); 
      return;
    }

    setLoading(true);
    
    // APPEL 1 : Les Modules de la filière
    const fetchModules = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then(r => r.json());

    // APPEL 2 : Les EFF de la filière (C'est ICI que ça se passe)
    const fetchEFFs = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`)
      .then(r => r.json());

    Promise.all([fetchModules, fetchEFFs])
      .then(([modData, effData]) => {
        // Stockage des modules
        setModules(modData.data || modData.modules || []);
        
        // Stockage des EFFs (Examens de Fin de Formation)
        // Ils seront disponibles pour TOUS les modules via l'onglet EFF
        const listeEffs = effData.data || effData.effs || (Array.isArray(effData) ? effData : []);
        setEffs(listeEffs);
        
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les données.");
        setLoading(false);
      });
  }, [filiere_id, navigate]);

  // --- 2. GESTION DE LA MODALE ---
  useEffect(() => {
    if (moduleSelectionne) {
      document.body.style.overflow = 'hidden'; // Bloque le scroll arrière
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

  // --- 3. CLIC SUR UN MODULE (Récupération EFM/CC/Cours) ---
  const handleModuleClick = async (module) => {
    if (!module?.id) return;

    setModuleSelectionne(module);
    setContentLoading(true);
    setActiveTab('courses'); // Onglet par défaut
    setModuleContent({ ccs: [], efms: [], courses: [] }); // Reset

    try {
      // On récupère les données SPÉCIFIQUES au module
      const [r1, r2, r3] = await Promise.all([
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/ccs`),  // Les CC
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/efms`), // Les EFM
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/courses`) // Les Cours
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
      {/* HEADER */}
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

        {loading && <p className="loading-text">Chargement des données...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {/* Empty State */}
        {!loading && modules.length === 0 && (
            <div className="empty-state">
                <div style={{fontSize: '50px', marginBottom: '15px'}}>📭</div>
                <h3>Aucun module trouvé</h3>
                <p>Cette filière ne contient pas encore de modules.</p>
            </div>
        )}

        {/* GRILLE DES MODULES */}
        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className="module-card"
              onClick={() => handleModuleClick(m)}
            >
              <div className="module-header">
                <h3>{m.name || m.module_name}</h3>
                {(m.code || m.module_code) && (
                   <span className="module-code">{m.code || m.module_code}</span>
                )}
              </div>
              
              {m.description && (
                <p style={{fontSize: '0.9rem', color: '#666', margin: '10px 0'}}>
                  {m.description.substring(0, 100)}...
                </p>
              )}

              <button className="select-module-btn">Ouvrir le module</button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE (POP-UP) --- */}
      {moduleSelectionne && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>{moduleSelectionne.name || moduleSelectionne.module_name}</h3>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {/* ONGLETS DE NAVIGATION */}
              <div className="tabs">
                <TabButton name="Cours" count={moduleContent.courses.length} active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                <TabButton name="CC" count={moduleContent.ccs.length} active={activeTab === 'ccs'} onClick={() => setActiveTab('ccs')} />
                <TabButton name="EFM" count={moduleContent.efms.length} active={activeTab === 'efms'} onClick={() => setActiveTab('efms')} />
                
                {/* L'onglet EFF affiche les données récupérées au chargement de la PAGE */}
                <TabButton name="EFF (Filière)" count={effs.length} active={activeTab === 'effs'} onClick={() => setActiveTab('effs')} />
              </div>

              {/* CONTENU DES ONGLETS */}
              <div className="tab-content">
                {contentLoading ? (
                  <div className="loading-text">Chargement du contenu...</div>
                ) : (
                  <>
                    {activeTab === 'courses' && <ListContent items={moduleContent.courses} type="Cours" />}
                    {activeTab === 'ccs' && <ListContent items={moduleContent.ccs} type="CC" />}
                    {activeTab === 'efms' && <ListContent items={moduleContent.efms} type="EFM" />}
                    {activeTab === 'effs' && (
                       <div>
                         <p style={{textAlign:'center', fontSize:'0.9rem', color:'#888', marginBottom:'20px'}}>
                           📁 Ces documents concernent toute la filière (Examens de Fin de Formation).
                         </p>
                         <ListContent items={effs} type="EFF" />
                       </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DÉCORATION */}
      <div className="triangles-container">
        {[...Array(30)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
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