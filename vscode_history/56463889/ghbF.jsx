import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../App.css";
import logo from "./images/image_etudia-removebg-preview.png";

export default function EtudiaModules() {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state;
  
  // --- 1. DÉCLARATION DES ETATS (HOOKS) ---
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Module sélectionné par l'utilisateur
  const [moduleSelectionne, setModuleSelectionne] = useState(null);
  
  // Contenu (séparé pour clarté)
  const [effs, setEffs] = useState([]); // Lié à la FILIÈRE
  const [moduleContent, setModuleContent] = useState({ // Lié au MODULE
    ccs: [],
    efms: [],
    courses: []
  });
  
  const [activeTab, setActiveTab] = useState('courses');
  const [contentLoading, setContentLoading] = useState(false);

  // --- 2. EXTRACTION DES IDs ---
  // On sécurise la récupération des IDs
  const filiere_id = selection?.filiere_id || selection?.filiere?.id;
  const year = selection?.year;
  const filiere = selection?.filiere;

  // --- 3. EFFETS (HOOKS) ---

  // Vérification de sécurité : redirection si pas d'ID
  useEffect(() => {
    if (!filiere_id) {
      console.error("Aucun ID de filière trouvé ! Redirection...");
      navigate('/selection');
    }
  }, [filiere_id, navigate]);

  // CHARGEMENT INITIAL : MODULES ET EFF (Basé sur filiere_id)
  useEffect(() => {
    if (!filiere_id) return;

    console.log("Chargement initial pour Filière ID:", filiere_id);
    setLoading(true);

    // Appel 1 : Récupérer les modules de la filière
    const fetchModules = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/modules`)
      .then(res => res.json());

    // Appel 2 : Récupérer les EFF de la filière (C'est ici qu'on utilise filiere_id)
    const fetchEFFs = fetch(`https://podo.b1.ma/api/public/filieres/${filiere_id}/effs`)
      .then(res => res.json());

    Promise.all([fetchModules, fetchEFFs])
      .then(([modulesData, effsData]) => {
        // Mise à jour des Modules
        setModules(modulesData.data || modulesData.modules || []);
        
        // Mise à jour des EFFs (Liste globale pour la filière)
        console.log("EFFs récupérés:", effsData);
        setEffs(effsData.data || effsData.effs || []);
        
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement initial:", err);
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      });

  }, [filiere_id]);

  // --- 4. FONCTIONS DE GESTION ---
  // ... (tout le reste du composant EtudiaModules reste identique)

// --- FONCTION UTILITAIRE POUR CORRIGER L'URL ---
const getFullFileUrl = (path) => {
  if (!path) return "#";
  
  // Si le lien est déjà complet (commence par http), on ne touche à rien
  if (path.startsWith("http")) return path;

  // On nettoie le chemin : si ça commence par un "/", on l'enlève pour éviter les doubles //
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // ON CONSTRUIT L'URL FINALE : Domaine API + storage + chemin du fichier
  return `https://podo.b1.ma/storage/${cleanPath}`;
};

// --- COMPOSANT D'AFFICHAGE ---
function ContentItem({ item, type }) {
  const fileUrl = getFullFileUrl(item.file_path);

  return (
    <div className="content-item">
      <h4>{type} - {item.title || item.name || "Sans titre"}</h4>
      
      {item.description && <p>{item.description}</p>}
      
      {item.date && <p className="date">Date: {item.date}</p>}
      
      {item.file_path ? (
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="download-link"
        >
          Télécharger 📥
        </a>
      ) : (
        <span style={{color:'red', fontSize:'12px'}}>Lien non disponible</span>
      )}
      
      {/* Optionnel : Pour débugger, vous pouvez décommenter la ligne ci-dessous */}
      {/* <small style={{display:'block', color:'#999', fontSize:'10px'}}>{fileUrl}</small> */}
    </div>
  );
}

  // Fonction appelée quand on clique sur un module
  const handleModuleClick = async (module) => {
    if (!module || !module.id) return;

    console.log("Module cliqué, ID:", module.id);
    setModuleSelectionne(module);
    setContentLoading(true);
    
    // Réinitialiser le contenu du module précédent pour éviter les confusions
    setModuleContent({ ccs: [], efms: [], courses: [] });

    try {
      // On lance les 3 appels en parallèle avec l'ID DU MODULE
      const [ccsRes, efmsRes, coursesRes] = await Promise.all([
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/ccs`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/efms`),
        fetch(`https://podo.b1.ma/api/public/modules/${module.id}/courses`)
      ]);

      const ccsData = await ccsRes.json();
      const efmsData = await efmsRes.json();
      const coursesData = await coursesRes.json();

      console.log("Données module reçues:", { ccs: ccsData, efms: efmsData, courses: coursesData });

      setModuleContent({
        ccs: ccsData.data || ccsData.ccs || [],
        efms: efmsData.data || efmsData.efms || [],
        courses: coursesData.data || coursesData.courses || []
      });

    } catch (err) {
      console.error("Erreur chargement contenu module:", err);
    } finally {
      setContentLoading(false);
    }
  };

  const handleBackToSelection = () => {
    navigate('/selection');
  };

  // --- 5. RENDU ---
  
  if (!filiere_id) return null;

  return (
    <div className="container">
      <div className="header">
        <div className="diagonal"></div>
        <div className="logo-container">
          <img src={logo} alt="Logo Etudia" />
        </div>
      </div>

      <button className="back-button" onClick={handleBackToSelection}>
        ← Retour à la sélection
      </button>

      <div className="welcome-box">
        <h2>Bienvenue sur votre espace modules ! 📚</h2>
        <p>Consultez vos modules et préparez vos examens.</p>
      </div>

      <div className="main-content">
        <h2 className="section-title">
          Modules - {year?.name || year?.year_name}
        </h2>
        <p className="filiere-info">Filière: {filiere?.name || filiere?.filiere_name}</p>

        {loading && <p className="loading-text">Chargement des données...</p>}
        {error && <p className="error-message">{error}</p>}
        
        {/* GRILLE DES MODULES */}
        <div className="modules-grid">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`module-card ${moduleSelectionne?.id === m.id ? "selected" : ""}`}
              onClick={() => handleModuleClick(m)}
            >
              <div className="module-header">
                <h3>{m.name || m.module_name}</h3>
                <span className="module-code">{m.code || m.module_code}</span>
              </div>
              <p>Crédits: {m.credits || 0} | Heures: {m.total_hours || m.hours || 0}h</p>
              <button className="select-module-btn">
                {moduleSelectionne?.id === m.id ? "Sélectionné" : "Voir contenu"}
              </button>
            </div>
          ))}
        </div>

        {/* DETAILS DU MODULE ET EFF */}
        {moduleSelectionne && (
          <div className="module-details">
            <h3>Contenu : {moduleSelectionne.name}</h3>
            
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
              {/* L'onglet EFF affiche les EFFs de la FILIÈRE */}
              <button 
                className={activeTab === 'effs' ? 'active' : ''}
                onClick={() => setActiveTab('effs')}
              >
                EFF ({effs.length})
              </button>
            </div>

            <div className="tab-content">
              {contentLoading ? (
                <p className="loading-text">Chargement du contenu du module...</p>
              ) : (
                <>
                  {/* COURS (Via Module ID) */}
                  {activeTab === 'courses' && (
                    <div className="content-list">
                      {moduleContent.courses.length === 0 ? <p>Aucun cours.</p> : moduleContent.courses.map((item) => (
                        <ContentItem key={item.id} type="Cours" item={item} />
                      ))}
                    </div>
                  )}

                  {/* CC (Via Module ID) */}
                  {activeTab === 'ccs' && (
                    <div className="content-list">
                      {moduleContent.ccs.length === 0 ? <p>Aucun CC.</p> : moduleContent.ccs.map((item) => (
                        <ContentItem key={item.id} type="CC" item={item} />
                      ))}
                    </div>
                  )}

                  {/* EFM (Via Module ID) */}
                  {activeTab === 'efms' && (
                    <div className="content-list">
                      {moduleContent.efms.length === 0 ? <p>Aucun EFM.</p> : moduleContent.efms.map((item) => (
                        <ContentItem key={item.id} type="EFM" item={item} />
                      ))}
                    </div>
                  )}

                  {/* EFF (Via Filiere ID - chargé au début) */}
                  {activeTab === 'effs' && (
                    <div className="content-list">
                       <p className="info-text">Les EFF concernent toute la filière.</p>
                      {effs.length === 0 ? <p>Aucun EFF disponible pour cette filière.</p> : effs.map((item) => (
                        <ContentItem key={item.id} type="EFF" item={item} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="triangles-container">
        {[...Array(12)].map((_, i) => <div key={i} className="triangle"></div>)}
      </div>
    </div>
  );
}

// Petit composant utilitaire pour afficher un élément (Cours/CC/EFM/EFF)
function ContentItem({ item, type }) {
  return (
    <div className="content-item">
      <h4>{type} - {item.title || item.name || "Sans titre"}</h4>
      {item.description && <p>{item.description}</p>}
      {item.date && <p className="date">Date: {item.date}</p>}
      {item.file_path ? (
        <a href={item.file_path} target="_blank" rel="noopener noreferrer" className="download-link">
          Télécharger
        </a>
      ) : (
        <span style={{color:'red', fontSize:'12px'}}>Lien non disponible</span>
      )}
    </div>
  );
}