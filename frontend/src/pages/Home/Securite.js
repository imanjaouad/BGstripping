import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Securite.css";

const Securite = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── PDF sélectionné localement (même logique que SecurityPage.jsx) ──
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [pdfName, setPdfName] = useState(null);

  // ── Images stockées localement (localStorage) ──
  const [localImages, setLocalImages] = useState([]);

  useEffect(() => {
    loadLocalImages();
    // Nettoyer la blob URL à la fermeture du composant
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    };
  }, []);

  // ══════════════════════════════════════
  // PDF — sélection locale (URL.createObjectURL)
  // ══════════════════════════════════════

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Révoquer l'ancienne blob URL avant d'en créer une nouvelle
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);

    const blobUrl = URL.createObjectURL(file);
    setPdfBlobUrl(blobUrl);
    setPdfName(file.name);

    e.target.value = ""; // reset input
  };

  const handleClosePdf = () => {
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    setPdfBlobUrl(null);
    setPdfName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadPdf = () => {
    if (!pdfBlobUrl) return;
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = pdfName || "document.pdf";
    a.click();
  };

  // ══════════════════════════════════════
  // IMAGES — localStorage
  // ══════════════════════════════════════

  const loadLocalImages = () => {
    try {
      const stored = localStorage.getItem("securite_images");
      if (stored) setLocalImages(JSON.parse(stored));
    } catch (e) {
      console.error("Erreur localStorage:", e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const newImage = {
        id: Date.now().toString(),
        name: file.name,
        data: event.target.result,
        date: new Date().toLocaleDateString("fr-FR"),
      };
      setLocalImages((prev) => {
        const updated = [...prev, newImage];
        localStorage.setItem("securite_images", JSON.stringify(updated));
        return updated;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteImage = (id) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    setLocalImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      localStorage.setItem("securite_images", JSON.stringify(updated));
      return updated;
    });
  };

  // ══════════════════════════════════════
  // RENDU
  // ══════════════════════════════════════

  return (
    <div className="securite-container">

      {/* ── Bouton retour ── */}
      <div className="back-btn-container">
        <button className="btn-back" onClick={() => navigate("/")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Retour à l'accueil
        </button>
      </div>

      <h1 className="securite-title">Suivi de la Sécurité</h1>

      <div className="banner-red">
        <span className="warning-icon">⚠️</span>
        LA SENSIBILISATION EST NOTRE PREMIER ENGAGEMENT
        <span className="warning-icon">⚠️</span>
      </div>

      {/* ══ SECTION PDF ══ */}
      <div className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📄</span>
          Documents PDF
        </h2>

        {/* Bouton sélection fichier */}
        <div className="upload-section">
          <p className="upload-label">Importer un document PDF</p>
          <div className="upload-buttons">
            <label className="btn-add-file">
              📄 Sélectionner un PDF
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
              />
            </label>
            {pdfName && (
              <span className="pdf-filename">{pdfName}</span>
            )}
          </div>
        </div>

        {/* Visionneuse PDF — iframe avec blob URL locale */}
        {pdfBlobUrl && (
          <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
              <span>📄 {pdfName}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn-download-viewer" onClick={handleDownloadPdf}>
                  ⬇ Télécharger
                </button>
                <button className="btn-close-viewer" onClick={handleClosePdf}>
                  ✕ Fermer
                </button>
              </div>
            </div>
            <iframe
              src={pdfBlobUrl}
              className="pdf-iframe"
              title={pdfName}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Securite;