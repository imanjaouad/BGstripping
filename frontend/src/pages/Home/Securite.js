import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Securite.css";

/**
 * Page de Sécurité — Permet le suivi de la sécurité et le téléchargement de documents.
 * Fidèle à l'interface demandée par l'utilisateur avec tableau de lecture.
 */
const Securite = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [importedFiles, setImportedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger la liste des fichiers au montage du composant
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/securite');
      if (response.ok) {
        const data = await response.json();
        setImportedFiles(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error);
    }
  };

  // Gérer la sélection de fichier (Déclenché par le bouton BLEU "Ajouter fichier")
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      alert("Fichier sélectionné : " + e.target.files[0].name + ". Cliquez sur 'Parcourir...' pour l'envoyer.");
    }
  };

  // Envoyer le fichier au serveur (Déclenché par le bouton VERT "Parcourir...")
  const handleUploadFile = async () => {
    if (!selectedFile) {
      alert("Veuillez d'abord sélectionner un fichier avec le bouton bleu 'Ajouter fichier'");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('type', 'document');

    try {
      const response = await fetch('http://localhost:8000/api/securite', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Fichier '" + selectedFile.name + "' importé avec succès !");
        setSelectedFile(null);
        fetchFiles(); // Rafraîchir la liste
      } else {
        const err = await response.json();
        alert("Erreur lors de l'importation : " + (err.message || "Erreur serveur"));
      }
    } catch (error) {
      alert("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  // Gérer l'aperçu d'image
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
          {/* Bouton VERT : Rôle d'envoi (Parcourir) */}
          <button className="btn-browse" onClick={handleUploadFile} disabled={loading}>
            {loading ? "Envoi..." : "Parcourir..."}
          </button>
          
          {/* Bouton BLEU : Rôle de sélection (Ajouter fichier) */}
          <label className="btn-add-file">
            Ajouter fichier
            <input type="file" onChange={handleFileChange} hidden />
          </label>
        </div>
        {selectedFile && (
          <p className="file-ready-text">
            Fichier prêt à être envoyé : <strong>{selectedFile.name}</strong>
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

      {/* ── TABLEAU DES FICHIERS IMPORTÉS ── */}
      <div className="files-table-container">
        <h2 className="table-title">Documents Importés</h2>
        {importedFiles.length === 0 ? (
          <p className="no-files-msg">Aucun document importé pour le moment.</p>
        ) : (
          <table className="securite-table">
            <thead>
              <tr>
                <th>Nom du fichier</th>
                <th>Date d'importation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {importedFiles.map((file) => (
                <tr key={file.id}>
                  <td>{file.filename}</td>
                  <td>{new Date(file.created_at).toLocaleDateString()}</td>
                  <td>
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-read-file"
                    >
                      Lire le fichier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Securite;