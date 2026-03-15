Voici le code **complet, corrigé et optimisé** de `src/components/EtudiaModules.jsx`.

Il inclut :
1.  La **correction des liens** (ajout de `storage/`).
2.  La **Modale (Pop-up)** pour éviter le scroll.
3.  La gestion des **filières vides** (Message "Oups, c'est vide").
4.  Les **Logs de débogage** pour comprendre pourquoi une filière a 0 module.
5.  Le blocage du scroll arrière-plan et la touche Echap.

Copiez tout ce code dans votre fichier :

```javascript
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

// --- FONCTION UTILITAIRE POUR CORRIGER LES LIENS ---
const getFullFileUrl = (path) => {
  if (!path) return "#";
  // Si le lien commence déjà par http, on le laisse tel quel
  if (path.startsWith("http")) return path;
  // Sinon on construit l'URL complète
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `https://podo.b1.ma/storage/${cleanPath}`;
};

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state;
  
  // --- ÉTATS (HOOKS) ---
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Gestion de la Modale
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  
  // Données de contenu
  const [effs, setEffs] = useState([]); // EFFs de la Filière
  const [moduleContent, setModuleContent] = useState({ 
    ccs: [], efms: [], courses: [] 
  });
  
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // --- RÉCUPÉRATION DES IDS ---
  // Utilisation de ?. pour éviter les crashs si undefined
  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- 1. CHARGEMENT INITIAL (Modules & EFF) ---
  useEffect(() => {
    // Si pas d'ID, on redirige
    if (!filiere_id) {
      navigate('/selection'); 
      return;
    }

    console.log("--- CHARGEMENT FILIÈRE ---");
    console.log("ID Filière:", filiere_id);

    setLoading(true);
    
    // Appel API pour les modules et les EFFs
    const fetchModules = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`).then(r => r.json());
    const fetchEFFs = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`).then(r => r.json());

    Promise.all([fetchModules, fetchEFFs])
      .then(([modData, effData]) => {
        
        // LOGS pour débugger les filières vides
        console.log("Réponse API Modules:", modData);

        // On cherche les données dans data, modules ou results
        const listeModules = modData.data || modData.modules || [];
        const listeEffs = effData.data || effData.effs || [];

        if (listeModules.length === 0) {
          console.warn("⚠️ Cette filière ne contient aucun module dans la base de données.");
        }

        setModules(listeModules);
        setEffs(listeEffs);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur API:", err);
        setError("Impossible de charger les données. Vérifiez votre connexion.");
        setLoading(false);
      });
  }, [filiere_id, navigate]);

  // --- 2. GESTION UX MODALE (Scroll & Echap) ---
  useEffect(() => {
    if (moduleSelectionne) {
      document.body.style.overflow = 'hidden'; // Bloque le scroll
    } else {
      document.body.style.overflow = 'unset'; // Réactive le scroll
    }

    // Fermer avec la touche Echap
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [moduleSelectionne]);


  // --- FONCTIONS ---
  const handleModuleClick = async (module) => {
    if (!module?.id) return;

    setModuleSelectionne(module); // Ouvre la modale
    setContentLoading(true);
    setActiveTab('courses'); // Onglet par défaut
    setModuleContent({ ccs: [], efms: [], courses: [] }); // Reset

    try {
      console.log(`Chargement contenu module ${module.id}...`);
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
      console.error("Erreur chargement détails:", err);
    } finally {
      setContentLoading(false);
    }
  };

  const closeModal = () => {
    setModuleSelectionne(null);
  };

  // Sécurité rendu
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

      {/* CONTENU PRINCIPAL */}
      <div className="main-content">
        <h2 className="section-title">
           Modules <span style={{fontSize:'0.6em', color:'#666', fontWeight:'normal'}}>({year?.name || year?.year_name})</span>
        </h2>
        <p className="filiere-info">{filiere?.name || filiere?.filiere_name}</p>

        {loading && <p className="loading-text">Chargement des données...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {/* CAS: 0 MODULES TROUVÉS (EMPTY STATE) */}
        {!loading && modules.length === 0 && (
            <div className="empty-state">
                <div style={{fontSize: '50px', marginBottom: '15px'}}>📭</div>
                <h3>Aucun module trouvé</h3>
                <p>Il semble que cette filière n'ait pas encore de modules enregistrés.</p>
                <p style={{fontSize:'12px', color:'#999'}}>ID Filière: {filiere_id}</p>
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
                <span className="module-code">{m.code || m.module_code}</span>
              </div>
              <p>{m.total_hours || m.hours || 0}h • {m.credits || 0} Crédits</p>
              <button className="select-module-btn">Ouvrir</button>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODALE (POP-UP) --- */}
      {moduleSelectionne && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Modale */}
            <div className="modal-header">
              <h3>{moduleSelectionne.name || moduleSelectionne.module_name}</h3>
              <button className="close-modal-btn" onClick={closeModal} title="Fermer">×</button>
            </div>

            {/* Corps Modale */}
            <div className="modal-body">
              {/* Onglets */}
              <div className="tabs">
                <TabButton name="Cours" count={moduleContent.courses.length} active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
                <TabButton name="CC" count={moduleContent.ccs.length} active={activeTab === 'ccs'} onClick={() => setActiveTab('ccs')} />
                <TabButton name="EFM" count={moduleContent.efms.length} active={activeTab === 'efms'} onClick={() => setActiveTab('efms')} />
                <TabButton name="EFF" count={effs.length} active={activeTab === 'effs'} onClick={() => setActiveTab('effs')} />
              </div>

              {/* Contenu Onglets */}
              <div className="tab-content">
                {contentLoading ? (
                  <div className="loading-text" style={{marginTop:'30px'}}>Chargement du contenu...</div>
                ) : (
                  <>
                    {activeTab === 'courses' && <ListContent items={moduleContent.courses} type="Cours" />}
                    {activeTab === 'ccs' && <ListContent items={moduleContent.ccs} type="CC" />}
                    {activeTab === 'efms' && <ListContent items={moduleContent.efms} type="EFM" />}
                    {activeTab === 'effs' && (
                       <div>
                         <p style={{fontSize:'13px', color:'#777', fontStyle:'italic', marginBottom:'15px', textAlign:'center'}}>
                           Documents communs à toute la filière
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
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

// Bouton d'onglet avec compteur
const TabButton = ({ name, count, active, onClick }) => (
  <button className={active ? 'active' : ''} onClick={onClick}>
    {name} {count > 0 && <span className="badge">({count})</span>}
  </button>
);

// Liste des éléments
function ListContent({ items, type }) {
  if (!items || items.length === 0) return <p className="empty-msg" style={{textAlign:'center', color:'#888', padding:'20px'}}>Aucun document "{type}" disponible.</p>;
  return (
    <div className="content-list">
      {items.map((item) => <ContentItem key={item.id} type={type} item={item} />)}
    </div>
  );
}

// Élément individuel (Cours, CC, etc.)
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