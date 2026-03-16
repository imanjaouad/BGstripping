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
              