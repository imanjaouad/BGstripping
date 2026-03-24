import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPoussages } from "../../features/poussageSlice";
import { fetchTransportJournaliers, saveTransportJournalier } from "../../features/transportSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import image from "../../images/ocpLogo.png";
import { FaArrowLeft, FaCalendarAlt, FaBolt, FaCalendarCheck, FaHardHat, FaFileExcel, FaTruck, FaTruckLoading, FaTruckMonster, FaInbox, FaWarehouse, FaShuttleVan, FaMapMarkerAlt, FaLayerGroup, FaRulerVertical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TransportSidebar from "./TransportSidebar";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes db-fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes db-shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes db-pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 20px 5px rgba(22,163,74,0.18)} }
  @keyframes db-countUp  { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
  @keyframes db-rowIn    { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
  @keyframes db-spin     { to { transform: rotate(360deg); } }

  .db-page { font-family:'Plus Jakarta Sans',sans-serif; }

  .db-kpi {
    background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:20px 22px; position:relative; overflow:hidden;
    opacity:0; animation:db-fadeUp .5s ease forwards;
    transition:transform .2s,box-shadow .2s; cursor:default;
  }
  .db-kpi:hover { transform:translateY(-5px); animation:db-pulse 2s ease infinite !important; }
  .db-kpi::before { content:''; position:absolute; top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size:200%;animation:db-shimmer 2.4s linear infinite; }
  .db-kpi-shimmer { position:absolute;inset:0;
    background:linear-gradient(100deg,transparent 25%,rgba(255,255,255,.6) 50%,transparent 75%);
    background-size:600px 100%;animation:db-shimmer 2.8s linear infinite;pointer-events:none; }
  .db-kpi-icon { width:36px;height:36px;background:#dcfce7;border-radius:10px;
    display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px; }
  .db-kpi-label { font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    color:#9ca3af;margin-bottom:6px; }
  .db-kpi-value { font-size:28px;font-weight:800;color:#15803d;line-height:1;
    animation:db-countUp .55s cubic-bezier(.34,1.56,.64,1) both; }
  .db-kpi-unit { font-size:13px;font-weight:500;color:#9ca3af;margin-left:3px; }

  .db-card {
    background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:24px 22px 20px; opacity:0; animation:db-fadeUp .55s ease forwards;
    transition:box-shadow .2s,transform .2s;
  }
  .db-card:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(22,163,74,0.11); }
  .db-card-title { font-size:14px;font-weight:700;color:#14532d;margin:0 0 3px; }
  .db-card-sub   { font-size:11px;color:#9ca3af;margin:0 0 18px; }
  .db-card-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px; }
  .db-pill { background:#dcfce7;color:#16a34a;font-size:11px;font-weight:600;
    padding:3px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0; }

  .db-section { font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
    color:#16a34a;margin:28px 0 14px;display:flex;align-items:center;gap:10px; }
  .db-section::after { content:'';flex:1;height:1px;background:#bbf7d0; }

  .db-grid2 { display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px; }
  .db-grid3 { display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px; }
  .db-grid4 { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px; }

  .db-table-wrap { overflow-x:auto; border-radius:12px; border:1.5px solid #bbf7d0; }
  .db-table { width:100%;border-collapse:collapse;font-size:12.5px; }
  .db-table thead tr { background:#15803d; }
  .db-table th { padding:11px 13px;text-align:left;font-size:10px;font-weight:700;
    letter-spacing:.07em;text-transform:uppercase;color:#fff;white-space:nowrap; }
  .db-table tbody tr {
    border-bottom:1px solid #f0fdf4;
    animation:db-rowIn .4s ease both;
    transition:background .15s;
  }
  .db-table tbody tr:hover { background:#f0fdf4; }
  .db-table tbody tr:last-child { border-bottom:none; }
  .db-table td { padding:10px 13px;color:#374151;vertical-align:middle;white-space:nowrap; }
  .db-table td:first-child { font-weight:600;color:#14532d; }

  .db-btn-excel { background:#166534;color:#fff;border:none;border-radius:10px;
    padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;
    display:inline-flex;align-items:center;gap:6px;transition:all .18s; }
  .db-btn-excel:hover { background:#15803d;transform:translateY(-1px); }
  
  .db-btn-back { background:#f0fdf4;color:#16a34a;border:1.5px solid #bbf7d0;
    border-radius:10px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;
    display:inline-flex;align-items:center;gap:8px;transition:all .18s; }
  .db-btn-back:hover { background:#dcfce7;border-color:#16a34a; }
  
  .filter-select { padding: 6px 12px; border-radius: 8px; border: 1.5px solid #bbf7d0; 
    font-size: 12px; color: #14532d; background: #fff; outline: none; cursor:pointer;}
  .filter-select:focus { border-color: #16a34a; }

  .date-input {
    padding: 6px 12px; border-radius: 8px; border: 1.5px solid #bbf7d0;
    font-size: 12px; color: #14532d; background: #fff; outline: none; cursor:pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .date-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

  .company-block {
    background: #fff; border-radius: 16px; border: 1.5px solid #bbf7d0;
    padding: 20px 22px; margin-bottom: 20px;
    opacity: 0; animation: db-fadeUp .55s ease forwards;
    transition: box-shadow .2s, transform .2s;
  }
  .company-block:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(22,163,74,0.11); }
  .company-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 18px;
    padding-bottom: 14px; border-bottom: 1.5px solid #f0fdf4;
  }
  .company-title { font-size: 17px; font-weight: 800; color: #15803d; }
  .company-subtitle { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .company-icon { width: 44px; height: 44px; border-radius: 12px; display: flex;
    align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }

  .moyen-tab {
    display: flex; gap: 8px; margin-bottom: 16px;
  }
  .moyen-tab button {
    padding: 6px 16px; border-radius: 8px; border: 1.5px solid #bbf7d0;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .moyen-tab button.active { background: #16a34a; color: #fff; border-color: #16a34a; }
  .moyen-tab button:not(.active) { background: #fff; color: #16a34a; }
  .moyen-tab button:not(.active):hover { background: #f0fdf4; }

  .camion-row {
    display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;
    align-items: center; background: #f0fdf4; border-radius: 10px;
    padding: 12px 14px; margin-bottom: 8px;
  }
  @media (max-width: 768px) {
    .camion-row { grid-template-columns: 1fr 1fr; }
  }
  .camion-label { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
  .camion-value { font-size: 15px; font-weight: 800; color: #15803d; }
  .camion-decape { font-size: 15px; font-weight: 800; color: #2563eb; }
  
  .input-camion {
    padding: 6px 10px; border-radius: 8px; border: 1.5px solid #bbf7d0;
    font-size: 13px; color: #14532d; background: #fff; outline: none; width: 100%;
    font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
    transition: border-color .18s, box-shadow .18s;
  }
  .input-camion:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

  .volume-saute-row {
    display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg, #dcfce7, #f0fdf4);
    border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;
    border: 1.5px solid #bbf7d0;
  }
  .volume-saute-icon { font-size: 28px; }
  .volume-saute-label { font-size: 10px; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: .1em; }
  .volume-saute-value { font-size: 24px; font-weight: 800; color: #15803d; }

  .db-empty { text-align: center; padding: 40px; color: #9ca3af; font-size: 14px; }

  .no-data-badge {
    background: #fef9c3; color: #854d0e; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px; white-space: nowrap;
  }
  .ok-badge {
    background: #dcfce7; color: #16a34a; font-size: 11px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px; white-space: nowrap;
  }
`;

const PALETTE = {
  emerald: "#16a34a", sky: "#22c55e", amber: "#4ade80",
  violet: "#15803d", rose: "#86efac",
  bg: "#f0fdf4", card: "#fff", border: "#bbf7d0", text: "#14532d", muted: "#6b7280",
};

function AnimCount({ target, duration = 1100 }) {
  const [val, setVal] = useState(0);
  const raf = React.useRef(null);
  React.useEffect(() => {
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val.toLocaleString();
}

// ─── Company Section Component ────────────────────────────────────────────────
// ─── Company Section Component ────────────────────────────────────────────────
function CompanySection({ name, icon, color, filteredPoussages, selectedDate, transportData, dispatch, isLimited = false, onVolumeDecapeChange }) {
  const entrepriseKey = name.toLowerCase();
  const [activeTab, setActiveTab] = useState("petits");

  // Find saved records for this company + date
  const savedPetits = transportData.find(
    (r) => r.date === selectedDate && r.entreprise === entrepriseKey && r.type_moyen === "petits"
  );
  const savedGrands = transportData.find(
    (r) => r.date === selectedDate && r.entreprise === entrepriseKey && r.type_moyen === "grands"
  );

  const [voyagesPetits, setVoyagesPetits] = useState(savedPetits?.nombre_voyages || 0);
  const [capacitePetits, setCapacitePetits] = useState(savedPetits?.capacite_camion || 20);
  const [voyagesGrands, setVoyagesGrands] = useState(savedGrands?.nombre_voyages || 0);
  const [capaciteGrands, setCapaciteGrands] = useState(savedGrands?.capacite_camion || 50);

  // États d'erreur pour chaque champ
  const [errVoyagesPetits, setErrVoyagesPetits] = useState("");
  const [errCapacitePetits, setErrCapacitePetits] = useState("");
  const [errVoyagesGrands, setErrVoyagesGrands] = useState("");
  const [errCapaciteGrands, setErrCapaciteGrands] = useState("");

  // Règles de validation
  const MAX_VOYAGES = 9999; // plafond raisonnable par jour
  const MAX_CAPACITE = 500; // tonnes max par camion

  function validateVoyages(v) {
    if (v <= 0) return "Le nombre de voyages doit être > 0";
    if (v > MAX_VOYAGES) return `Le nombre de voyages ne peut pas dépasser ${MAX_VOYAGES}`;
    return "";
  }

  function validateCapacite(v) {
    if (v <= 0) return "La capacité doit être supérieure à 0 t";
    if (v > MAX_CAPACITE) return `La capacité ne peut pas dépasser ${MAX_CAPACITE} t`;
    return "";
  }

  // Sync when date or saved data changes
  useEffect(() => {
    setVoyagesPetits(savedPetits?.nombre_voyages || 0);
    setCapacitePetits(savedPetits?.capacite_camion || 20);
    setVoyagesGrands(savedGrands?.nombre_voyages || 0);
    setCapaciteGrands(savedGrands?.capacite_camion || 50);
    // Réinitialise les erreurs quand la date change
    setErrVoyagesPetits(""); setErrCapacitePetits("");
    setErrVoyagesGrands(""); setErrCapaciteGrands("");
  }, [selectedDate, savedPetits?.nombre_voyages, savedPetits?.capacite_camion, savedGrands?.nombre_voyages, savedGrands?.capacite_camion]);

  // Sauvegarde automatique avec délai (debounce)
  const timerRef = useRef(null);
  const autoSave = useCallback((typeMoyen, voyages, capacite) => {
    if (!selectedDate) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dispatch(saveTransportJournalier({
        operation_date: selectedDate,
        entreprise: entrepriseKey,
        type_moyen: typeMoyen,
        nombre_voyages: voyages,
        capacite_camion: capacite,
      }));
    }, 800);
  }, [selectedDate, entrepriseKey, dispatch]);

  // Gestionnaires de changement avec validation intégrée
  const handleVoyagesPetits = (v) => {
    setVoyagesPetits(v);
    const err = validateVoyages(v);
    setErrVoyagesPetits(err);
    if (!err) { autoSave("petits", v, capacitePetits); onVolumeDecapeChange?.(v * capacitePetits + voyagesGrands * capaciteGrands); }
  };
  const handleCapacitePetits = (v) => {
    setCapacitePetits(v);
    const err = validateCapacite(v);
    setErrCapacitePetits(err);
    if (!err) { autoSave("petits", voyagesPetits, v); onVolumeDecapeChange?.(voyagesPetits * v + voyagesGrands * capaciteGrands); }
  };
  const handleVoyagesGrands = (v) => {
    setVoyagesGrands(v);
    const err = validateVoyages(v);
    setErrVoyagesGrands(err);
    if (!err) { autoSave("grands", v, capaciteGrands); onVolumeDecapeChange?.(voyagesPetits * capacitePetits + v * capaciteGrands); }
  };
  const handleCapaciteGrands = (v) => {
    setCapaciteGrands(v);
    const err = validateCapacite(v);
    setErrCapaciteGrands(err);
    if (!err) { autoSave("grands", voyagesGrands, v); onVolumeDecapeChange?.(voyagesPetits * capacitePetits + voyagesGrands * v); }
  };

  // Volume sauté total pour la date sélectionnée (tous conducteurs)
  const volumeSaute = filteredPoussages.reduce(
    (sum, p) => sum + Number(p.volume_soté || 0), 0
  );

  const volumeDecapePetits = voyagesPetits * capacitePetits;
  const volumeDecapeGrands = voyagesGrands * capaciteGrands;
  const volumeDecapeTotal = volumeDecapePetits + volumeDecapeGrands;

  return (
    <div className="company-block" style={{ animationDelay: "0.2s", borderColor: color, borderTopWidth: 3 }}>
      <div className="company-header">
        <div className="company-icon" style={{ background: color + "22" }}>
          {icon}
        </div>
        <div>
          <div className="company-title">{name}</div>
          <div className="company-subtitle">
            Sous-traitant OCP — Décapage minier
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          {selectedDate ? (
            <span className="ok-badge">📅 {selectedDate}</span>
          ) : (
            <span className="no-data-badge">Sélectionner une date</span>
          )}
        </div>
      </div>

      {/* Volume Sauté dynamique — diminue selon les voyages */}
      {(() => {
        const volumeRestant = volumeSaute - volumeDecapeTotal;
        const pct = volumeSaute > 0 ? Math.min((volumeDecapeTotal / volumeSaute) * 100, 100) : 0;
        const isOver = volumeRestant < 0;
        const isDone = volumeRestant === 0 && volumeSaute > 0;
        const barColor = isOver ? "#ef4444" : pct > 80 ? "#f59e0b" : "#16a34a";
        const restantColor = isOver ? "#dc2626" : pct > 80 ? "#d97706" : "#15803d";
        return (
          <div style={{
            background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
            border: "1.5px solid #bbf7d0", borderRadius: 12,
            padding: "14px 18px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaBolt size={20} style={{ color: "#16a34a" }} />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".1em" }}>
                    Volume Sauté Initial
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#15803d" }}>
                    {volumeSaute.toLocaleString()} <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>t</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".1em" }}>
                  Volume Sauté Restant
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: restantColor, lineHeight: 1.1 }}>
                  {isOver ? "−" : ""}{Math.abs(volumeRestant).toLocaleString()}
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginLeft: 3 }}>t</span>
                </div>
                {isOver && (
                  <div style={{ fontSize: 10, color: "#dc2626", fontWeight: 700, marginTop: 2 }}>
                    ⚠ Dépassé de {Math.abs(volumeRestant).toLocaleString()} t
                  </div>
                )}
                {isDone && (
                  <div style={{ fontSize: 10, color: "#16a34a", fontWeight: 700, marginTop: 2 }}>
                    ✅ Tout transporté !
                  </div>
                )}
              </div>
            </div>

            {/* Barre de progression */}
            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginBottom: 4 }}>
                <span>Transporté : <strong style={{ color: "#2563eb" }}>{volumeDecapeTotal.toLocaleString()} t</strong></span>
                <span>{pct.toFixed(1)}%</span>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: 20, height: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 20,
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${barColor}, ${barColor}aa)`,
                  transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Données Sautage : Panneau / Tranchée / Niveau ── */}
      {filteredPoussages.length > 0 && (() => {
        const panneaux = [...new Set(filteredPoussages.map(p => p.panneau).filter(Boolean))];
        const tranchees = [...new Set(filteredPoussages.map(p => p.tranchee).filter(Boolean))];
        const niveaux = [...new Set(filteredPoussages.map(p => p.niveau).filter(Boolean))];
        const chip = (val, bg, color) => (
          <span key={val} style={{
            background: bg, color, fontWeight: 700, fontSize: 11,
            padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
          }}>{val}</span>
        );
        return (
          <div style={{
            background: "#f8fffe", border: "1.5px solid #bbf7d0", borderRadius: 12,
            padding: "12px 16px", marginBottom: 14,
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12,
          }}>
            {/* Panneau */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <FaMapMarkerAlt style={{ color: "#16a34a" }} /> Panneau
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {panneaux.length > 0
                  ? panneaux.map(v => chip(v, "#dcfce7", "#15803d"))
                  : <span style={{ color: "#d1d5db", fontSize: 11 }}>—</span>}
              </div>
            </div>
            {/* Tranchée */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <FaLayerGroup style={{ color: "#2563eb" }} /> Tranchée
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {tranchees.length > 0
                  ? tranchees.map(v => chip(v, "#dbeafe", "#1e40af"))
                  : <span style={{ color: "#d1d5db", fontSize: 11 }}>—</span>}
              </div>
            </div>
            {/* Niveau */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                <FaRulerVertical style={{ color: "#d97706" }} /> Niveau
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {niveaux.length > 0
                  ? niveaux.map(v => chip(v, "#fef3c7", "#92400e"))
                  : <span style={{ color: "#d1d5db", fontSize: 11 }}>—</span>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="moyen-tab">
        <button className={activeTab === "petits" ? "active" : ""} onClick={() => setActiveTab("petits")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaTruck size={13} /> Petits Moyens
        </button>
        <button className={activeTab === "grands" ? "active" : ""} onClick={() => setActiveTab("grands")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaTruckMonster size={13} /> Grands Moyens
        </button>
      </div>

      {activeTab === "petits" && (
        <div>
          <div className="camion-row">
            <div>
              <div className="camion-label">Nombre de Voyages</div>
              {isLimited ? (
                <div className="camion-value">{voyagesPetits}</div>
              ) : (
                <>
                  <input
                    className="input-camion"
                    type="number"
                    value={voyagesPetits}
                    style={errVoyagesPetits ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {}}
                    onChange={(e) => handleVoyagesPetits(Number(e.target.value))}
                    placeholder="0"
                  />
                  {errVoyagesPetits && (
                    <div style={{ color: "#dc2626", fontSize: 10, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      ⚠ {errVoyagesPetits}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <div className="camion-label">Capacité Camion (t)</div>
              {isLimited ? (
                <div className="camion-value">{capacitePetits}</div>
              ) : (
                <>
                  <input
                    className="input-camion"
                    type="number"
                    value={capacitePetits}
                    style={errCapacitePetits ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {}}
                    onChange={(e) => handleCapacitePetits(Number(e.target.value))}
                    placeholder="20"
                  />
                  {errCapacitePetits && (
                    <div style={{ color: "#dc2626", fontSize: 10, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      ⚠ {errCapacitePetits}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <div className="camion-label">Volume Décapé</div>
              <div className="camion-decape">{volumeDecapePetits.toLocaleString()} t</div>
            </div>
            <div>
              <div className="camion-label">Calcul</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
                {voyagesPetits} voyage{voyagesPetits !== 1 ? "s" : ""} × {capacitePetits} t
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "grands" && (
        <div>
          <div className="camion-row">
            <div>
              <div className="camion-label">Nombre de Voyages</div>
              {isLimited ? (
                <div className="camion-value">{voyagesGrands}</div>
              ) : (
                <>
                  <input
                    className="input-camion"
                    type="number"
                    value={voyagesGrands}
                    style={errVoyagesGrands ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {}}
                    onChange={(e) => handleVoyagesGrands(Number(e.target.value))}
                    placeholder="0"
                  />
                  {errVoyagesGrands && (
                    <div style={{ color: "#dc2626", fontSize: 10, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      ⚠ {errVoyagesGrands}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <div className="camion-label">Capacité Camion (t)</div>
              {isLimited ? (
                <div className="camion-value">{capaciteGrands}</div>
              ) : (
                <>
                  <input
                    className="input-camion"
                    type="number"
                    value={capaciteGrands}
                    style={errCapaciteGrands ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.12)" } : {}}
                    onChange={(e) => handleCapaciteGrands(Number(e.target.value))}
                    placeholder="50"
                  />
                  {errCapaciteGrands && (
                    <div style={{ color: "#dc2626", fontSize: 10, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                      ⚠ {errCapaciteGrands}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <div className="camion-label">Volume Décapé</div>
              <div className="camion-decape">{volumeDecapeGrands.toLocaleString()} t</div>
            </div>
            <div>
              <div className="camion-label">Calcul</div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>
                {voyagesGrands} voyage{voyagesGrands !== 1 ? "s" : ""} × {capaciteGrands} t
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary footer */}
      <div style={{
        marginTop: 16, padding: "12px 16px", background: "#f0fdf4",
        borderRadius: 10, border: "1.5px solid #bbf7d0",
        display: "flex", gap: 24, flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
            Volume Décapé Total (Petits + Grands)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>
            {volumeDecapeTotal.toLocaleString()} <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>t</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
            Total Voyages
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#15803d" }}>
            {(voyagesPetits + voyagesGrands).toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em" }}>
            Volume Sauté Poussage
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#d97706" }}>
            {volumeSaute.toLocaleString()} <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>t</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function TransportDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Role check ──────────────────────────────────────────────
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isLimited = currentUser?.role === "limited";

  const poussages = useSelector((s) => s.poussage?.list || []);
  const transportData = useSelector((s) => s.transport?.list || []);

  // ─── Filters ─────────────────────────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // default: today
  });
  const [volumeDecapeProcaneq, setVolumeDecapeProcaneq] = useState(0);
  const [volumeDecapeTranswine, setVolumeDecapeTranswine] = useState(0);

  useEffect(() => {
    dispatch(fetchPoussages());
    dispatch(fetchTransportJournaliers());
  }, [dispatch]);

  // Filter poussages by selected date
  const filteredPoussages = selectedDate
    ? poussages.filter((p) => p.date === selectedDate)
    : poussages;

  // ─── KPIs ────────────────────────────────────────────────────────────────────
  const totalVolumeSaute = filteredPoussages.reduce(
    (sum, p) => sum + Number(p.volume_soté || 0), 0
  );
  const totalVolumeRestant = Math.max(0, totalVolumeSaute - volumeDecapeProcaneq - volumeDecapeTranswine);
  const totalOps = filteredPoussages.length;

  const anim = (delay) => ({ style: { animationDelay: delay } });

  // ─── Volume Sauté par Jour (last 7 days) ──────────────────────────────────
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split("T")[0]);
  }

  const volumeParJour = last7Days.map((day) => {
    return poussages
      .filter((p) => p.date === day)
      .reduce((sum, p) => sum + Number(p.volume_soté || 0), 0);
  });

  const dayLabels = last7Days.map((d) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("fr-MA", { day: "2-digit", month: "short" });
  });

  const barData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Volume Sauté (t)",
        data: volumeParJour,
        backgroundColor: last7Days.map((d) =>
          d === selectedDate ? "#16a34a" : "#bbf7d0"
        ),
        borderRadius: { topLeft: 8, topRight: 8 },
        barPercentage: 0.65,
      },
    ],
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#bbf7d0",
        borderWidth: 1.5,
        titleColor: "#14532d",
        bodyColor: "#6b7280",
        padding: 12,
        cornerRadius: 10,
        callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} t` },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 } },
      },
      y: {
        grid: { color: "rgba(22,163,74,0.07)", drawBorder: false },
        ticks: { color: "#9ca3af", font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 } },
        title: { display: true, text: "Volume (t)", color: "#6b7280", font: { size: 10 } },
      },
    },
  };

  // Excel export
  const exportExcel = () => {
    const rows = filteredPoussages.map((p) => ({
      Date: p.date,
      Conducteur: p.conducteur,
      Panneau: p.panneau,
      Tranchée: p.tranchee,
      "Volume Sauté (t)": p.volume_soté,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transport");
    saveAs(
      new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]),
      `transport_${selectedDate}.xlsx`
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: PALETTE.bg }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <TransportSidebar />

        {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
        <div
          className="db-page"
          style={{ flex: 1, minHeight: "100vh", background: PALETTE.bg, padding: "28px 24px 60px", overflowY: "auto" }}
        >
          {/* ── HEADER ──────────────────────────────────────────────────────────── */}
          <div
            className="db-card"
            style={{
              marginBottom: 24, padding: "18px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              ...anim("0s").style,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <button className="db-btn-back" onClick={() => navigate("/")}>
                <FaArrowLeft /> Retour
              </button>
              <div>
                <div
                  style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: ".16em",
                    textTransform: "uppercase", color: PALETTE.muted, marginBottom: 4,
                  }}
                >
                  Logistique & Transport
                </div>
                <h1
                  style={{
                    margin: 0, fontSize: 24, fontWeight: 800,
                    background: "linear-gradient(135deg,#15803d,#22c55e)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}
                >
                  Tableau de Bord{" "}
                  <span style={{ WebkitTextFillColor: "#16a34a" }}>Transport</span>
                </h1>
              </div>
            </div>

            {/* Date Input */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FaCalendarAlt style={{ color: "#16a34a", fontSize: 16 }} />
                <label
                  style={{
                    fontSize: 11, fontWeight: 700, color: "#14532d",
                    textTransform: "uppercase", letterSpacing: ".1em",
                  }}
                >
                  Date
                </label>
                <input
                  className="date-input"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <img
                src={image}
                alt="logo"
                style={{ height: 46, borderRadius: 10, boxShadow: "0 4px 14px rgba(22,163,74,0.2)" }}
              />
            </div>
          </div>

          {/* ── KPIs ──────────────────────────────────────────────────────────────── */}
          <div className="db-grid3" style={{ marginBottom: 24 }}>
            {/* KPI 1 — Volume Sauté Restant — VERT */}
            <div className="db-kpi" style={{ animationDelay: "0.05s", borderColor: "#16a34a" }}>
              <div className="db-kpi-shimmer" />
              <div className="db-kpi-icon" style={{ background: "#dcfce7", color: "#16a34a" }}><FaBolt /></div>
              <div className="db-kpi-label">Volume Sauté Restant</div>
              <div className="db-kpi-value" style={{ color: "#15803d" }}>
                <AnimCount target={totalVolumeRestant} />
                <span className="db-kpi-unit">t</span>
              </div>
              <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 4 }}>
                Initial : {totalVolumeSaute.toLocaleString()} t
              </div>
            </div>

            {/* KPI 2 — Date Sélectionnée — BLEU */}
            <div className="db-kpi" style={{ animationDelay: "0.10s", borderColor: "#3b82f6" }}>
              <div className="db-kpi-shimmer" />
              <div className="db-kpi-icon" style={{ background: "#dbeafe", color: "#2563eb" }}><FaCalendarCheck /></div>
              <div className="db-kpi-label" style={{ color: "#1e40af" }}>Date Sélectionnée</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1d4ed8", marginTop: 6 }}>
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-MA", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })
                  : "—"}
              </div>
            </div>

            {/* KPI 3 — Opérations du Jour — AMBRE */}
            <div className="db-kpi" style={{ animationDelay: "0.15s", borderColor: "#f59e0b" }}>
              <div className="db-kpi-shimmer" />
              <div className="db-kpi-icon" style={{ background: "#fef3c7", color: "#d97706" }}><FaHardHat /></div>
              <div className="db-kpi-label" style={{ color: "#92400e" }}>Opérations du Jour</div>
              <div className="db-kpi-value" style={{ color: "#b45309" }}>
                <AnimCount target={totalOps} />
                <span className="db-kpi-unit">ops</span>
              </div>
            </div>
          </div>

          {/* ── VOLUME SAUTÉ PAR JOUR chart ──────────────────────────────────────── */}
          <div className="db-card" {...anim("0.20s")} style={{ marginBottom: 24 }}>
            <div className="db-card-header">
              <div>
                <p className="db-card-title">Volume Sauté par Jour</p>
                <p className="db-card-sub">7 derniers jours — données depuis le formulaire Poussage</p>
              </div>
              <span className="db-pill">📊 Poussage</span>
            </div>
            <div style={{ height: 280 }}>
              <Bar data={barData} options={barOpts} />
            </div>
          </div>

          {/* ── COMPANIES ─────────────────────────────────────────────────────────── */}
          <div className="db-section" style={{ marginTop: 8 }}>
            Entreprises Sous-traitantes OCP
          </div>

          {/* PROCANEQ */}
          <div id="section-procaneq">
            <CompanySection
              name="Procaneq"
              icon={<FaWarehouse style={{ color: "#f59e0b", fontSize: 22 }} />}
              color="#f59e0b"
              filteredPoussages={filteredPoussages}
              selectedDate={selectedDate}
              transportData={transportData}
              dispatch={dispatch}
              isLimited={isLimited}
              onVolumeDecapeChange={setVolumeDecapeProcaneq}
            />
          </div>

          {/* TRANSWINE */}
          <div id="section-transwine">
            <CompanySection
              name="Transwine"
              icon={<FaShuttleVan style={{ color: "#3b82f6", fontSize: 22 }} />}
              color="#3b82f6"
              filteredPoussages={filteredPoussages}
              selectedDate={selectedDate}
              transportData={transportData}
              dispatch={dispatch}
              isLimited={isLimited}
              onVolumeDecapeChange={setVolumeDecapeTranswine}
            />
          </div>

          {/* ── POUSSAGE TABLE for selected day ─────────────────────────────────── */}
          <div className="db-section">Détail Poussage — {selectedDate || "Tout l'historique"}</div>
          <div className="db-card" {...anim("0.45s")}>
            <div
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 16,
              }}
            >
              <p className="db-card-title" style={{ margin: 0 }}>
                {filteredPoussages.length} opération(s) ce jour
              </p>
              <button className="db-btn-excel" onClick={exportExcel} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <FaFileExcel /> Exporter Excel
              </button>
            </div>

            {filteredPoussages.length > 0 ? (
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Conducteur</th>
                      <th>Panneau</th>
                      <th>Tranchée</th>
                      <th>Niveau</th>
                      <th>Volume Sauté (t)</th>
                      <th>Poste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPoussages.map((p, i) => (
                      <tr key={p.id || i} style={{ animationDelay: `${i * 0.04}s` }}>
                        <td>{p.date || "—"}</td>
                        <td>{p.conducteur || "—"}</td>
                        <td>{p.panneau || "—"}</td>
                        <td>{p.tranchee || "—"}</td>
                        <td>{p.niveau || "—"}</td>
                        <td style={{ color: "#16a34a", fontWeight: 700 }}>
                          {Number(p.volume_soté || 0).toLocaleString()} t
                        </td>
                        <td>{p.poste || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="db-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <FaInbox size={36} style={{ color: "#d1fae5" }} />
                Aucune opération de poussage pour le {selectedDate}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
