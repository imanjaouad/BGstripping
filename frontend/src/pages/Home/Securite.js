import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Securite.css";

/**
 * Page de Sécurité — Permet le suivi de la sécurité et le téléchargement de documents.
 * Fidèle à l'interface demandée par l'utilisateur.
 */
const Securite = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Gérer la sélection de fichier pour le document
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log("Fichier sélectionné :", e.target.files[0].name);
    }
  };

  // Fonction pour l'envoi effectif du fichier (Appel API)
  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner un fichier avec le bouton 'Parcourir...'");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', 'document');

    try {
      // Remplacez l'URL par celle de votre API Laravel
      const response = await fetch('http://localhost:8000/api/securite', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Fichier '" + selectedFile.name + "' ajouté avec succès !");
        setSelectedFile(null);
      } else {
        const err = await response.json();
        alert("Erreur lors de l'ajout : " + (err.message || "Erreur serveur"));
      }
    } catch (error) {
      console.error("Erreur API:", error);
      alert("Erreur de connexion au serveur.");
    }
  };

  // Gérer l'ajout d'une image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="securite-container">
      {/* ── Bouton Retour ── */}
      <div className="back-btn-container">
        <button className="btn-back" onClick={() => navigate("/")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour à l'accueil
        </button>
      </div>

      {/* ── Titre de la page ── */}
      <h1 className="securite-title">Suivi de la Sécurité</h1>

      {/* ── Section Téléchargement de document ── */}
      <div className="upload-section">
        <p className="upload-label">Télécharger un document</p>
        <div className="upload-buttons">
          <label className="btn-browse">
            Parcourir...
            <input type="file" onChange={handleFileChange} hidden />
          </label>
          <button className="btn-add-file" onClick={handleUploadFile}>
            Ajouter fichier
          </button>
        </div>
        {selectedFile && (
          <p style={{ fontSize: '12px', color: '#14532d', marginTop: '8px' }}>
            Fichier prêt : <strong>{selectedFile.name}</strong>
          </p>
        )}
      </div>

      {/* ── Bannière de sensibilisation ── */}
      <div className="banner-red">
        <span className="warning-icon">⚠️</span>
        LA SENSIBILISATION EST NOTRE PREMIER ENGAGEMENT
        <span className="warning-icon">⚠️</span>
      </div>

      {/* ── Zone d'affichage d'image ── */}
      <div className="image-display-area">
        {imagePreview ? (
          <img src={imagePreview} alt="Aperçu sécurité" className="preview-img" />
        ) : (
          <p className="no-image-text">Aucune image pour le moment</p>
        )}
      </div>

      {/* ── Bouton Ajouter une image ── */}
      <div className="add-image-footer">
        <label className="btn-add-image">
          Ajouter une image
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
      </div>
    </div>
  );
};

export default Securite;
