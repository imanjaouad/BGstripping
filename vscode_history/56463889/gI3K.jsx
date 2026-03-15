import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

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

  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- CHARGEMENT ---
  useEffect(() => {
    if (!filiere_id) { navigate('/selection'); return; }
    setLoading(true);
    
    Promise.all([
      fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`).then(r => r.json()),
      fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`).then(r => r.json())
    ]).then(([modData, effData]) => {
        setModules(modData.data || modData.modules || []);
        setEffs(effData.data || effData.effs || []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setError("Impossible de charger les données.");
        setLoading(false);
      });
  }, [filiere_id, navigate]);

  // --- MODALE ---
  useEffect(() => {
    if (moduleSelectionne) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = 'unset'; }
    const handleEsc = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleEsc);
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleEsc); };
  }, [moduleSelectionne]);

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
    } catch (err) { console.error(err); } 
    finally { setContentLoading(false); }
  };

  const closeModal = () => { setModuleSelectionne(null); };

  if (!filiere_id) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container"><img src={logo} alt="Logo" /></div>
      </div>

      <button className="back-button" onClick={() => navigate('/selection')}>← Retour aux filières</button>

      {/* --- C'EST ICI QUE ÇA CHANGE --- */}
      <div className="main-content">
        
        {/* TITRE AVEC COMPTEUR TOTAL */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <div>
                <h2 className="section-title" style={{marginBottom:'5px'}}>
                Modules <span style={{fontWeight:'normal', color:'#666'}}>({year?.name})</span>
                </h2>
                <p className="filiere-info">{filiere?.name}</p>
            </div>
            {/* Badge compteur Total */}
            {!loading && (
                <div style={{
                    background:'#007bff', color:'white', padding:'10px 20px', 
                    borderRadius:'30px', fontWeight:'bold', boxShadow:'0 4px 10px rgba(0,123,255,0.3)'
                }}>
                    {modules.length} Modules
                </div>
            )}
        </div>

        {loading && <p className="loading-text">Chargement des données...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {!loading && modules.length === 0 && (
            <div className="empty-state">
                <div style={{fontSize: '50px', marginBottom: '15px'}}>📭</div>
                <h3>Aucun module trouvé</h3>
                <p>Cette filière ne contient pas encore de modules.</p>
            </div>
        )}

        <div className="modules-grid">
          {/* On ajoute l'index (i) pour numéroter les boutons */}
          {modules.map((m, i) => (
            <div key={m.id} className="module-card" onClick={() => handleModuleClick(m)}>
              <div className="module-header">
                <h3>{m.name || m.module_name}</h3>
                {(m.code || m.module_code) && <span className="module-code">{m.code || m.module_code}</span>}
              </div>
              
              {m.description && (
                <p style={{fontSize: '0.9rem', color: '#666', margin: '10px 0'}}>
                  {m.description.substring(0, 100)}...
                </p>
              )}

              {/* BOUTON AVEC NUMÉRO */}
              <button className="select-module-btn">
                 Ouvrir le module #{i + 1} ➔
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE --- */}
      {moduleSelectionne && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{moduleSelectionne.name}</h3>
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
                  <div className="loading-text">Chargement...</div>
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

      <div className="triangles-container">
        {[...Array(30)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

// SOUS-COMPOSANTS
const TabButton = ({ name, count, active, onClick }) => (
  <button className={active ? 'active' : ''} onClick={onClick}>
    {name} {count > 0 && <span className="badge">({count})</span>}
  </button>
);
function ListContent({ items, type }) {
  if (!items || items.length === 0) return <p className="empty-msg" style={{textAlign:'center', color:'#888', padding:'20px'}}>Aucun {type}.</p>;
  return <div className="content-list">{items.map((item) => <ContentItem key={item.id} type={type} item={item} />)}</div>;
}
function ContentItem({ item, type }) {
  const fileUrl = getFullFileUrl(item.file_path);
  return (
    <div className="content-item">
      <div className="content-info">
        <h4>{type} - {item.title || item.name || "Document"}</h4>
        {item.date && <small>Date: {item.date}</small>}
      </div>
      {item.file_path ? <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="download-btn">Télécharger</a> : <span className="no-link">Indisponible</span>}
    </div>
  );
}