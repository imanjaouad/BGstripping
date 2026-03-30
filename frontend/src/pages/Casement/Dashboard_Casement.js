import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import image from "../../images/image3.webp";
import "../../style/Casement.css"
/* ═══════════════════════════════════════════════════════════════════════════
   ACCUEIL CASEMENT  — Page d'accueil du module
   Style identique au reste du module (Plus Jakarta Sans, palette verte)
═══════════════════════════════════════════════════════════════════════════ */

function DashboardCasement() {
  const navigate = useNavigate();
  const casements = useSelector((s) => s.casement?.list || []);

  const totalVolume = casements.reduce(
    (a, c) => a + Number(c.volume_saute || 0),
    0,
  );
  const totalCoups = casements.reduce(
    (a, c) => a + Number(c.nombreCoups || 0),
    0,
  );
  const totalTemps = casements.reduce((a, c) => a + Number(c.temps || 0), 0);
  const totalOps = casements.length;
  const rendMoyen =
    totalOps > 0
      ? (
          casements.reduce((a, c) => {
            const v = Number(c.volume_saute || 0),
              t = Number(c.temps || 0);
            return a + (t > 0 ? v / t : 0);
          }, 0) / totalOps
        ).toFixed(1)
      : 0;
  const enMarcheCnt = casements.filter(
    (c) => c.etatMachine === "marche",
  ).length;

  const recentCasements = [...casements].slice(-6).reverse();

  const BASE = "/operations/casement";
  const navCards = [
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
      title: "Tableau de Bord",
      path: `${BASE}`,
      desc: "Saisie des opérations de cassage. Formulaire complet avec calcul automatique du rendement.",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
      title: "Statistiques",
      path: `${BASE}/statistique`,
      desc: "Graphes de volume par engin et par tranchée. Analyse complète des performances.",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
      title: "Historique",
      path: `${BASE}/historique`,
      desc: "Tableau filtrable de toutes les opérations enregistrées. Export Excel disponible.",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
      title: "Rapport",
      path: `${BASE}/statistique`,
      desc: "Synthèse mensuelle et annuelle. Génération automatique des rapports PDF/Excel.",
    },
    {
      icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
      title: "Coûts",
      path: `${BASE}/couts`,
      desc: "Suivi budgétaire par coup. Calcul du coût mensuel et de la répartition annuelle.",
    },
  ];

  return (
    <>
      
      <div className="acc-root">
        <div className="acc-bg" />
        <div className="acc-dots" />
        <div className="acc-content">
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <div className="acc-hero">
            <div>
              <h1 className="acc-hero-title">
                Gestion du <span>Casement</span>
              </h1>
              <p className="acc-hero-sub">
                Suivi des opérations de cassage par — volumes, équipements,
                rendements, coûts et rapports en temps réel.
              </p>
              {/* ── Definition de casement ──────────────────────────────────────────────────────── */}
              <div></div>
              <div className="acc-hero-actions">
                <button className="acc-btn-primary" onClick={() => navigate(`${BASE}/gestion`)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Nouvelle saisie
                </button>
                <button className="acc-btn-secondary" onClick={() => navigate(`${BASE}/statistique`)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  Voir les statistiques
                </button>
              </div>
            </div>
            <img src={image} alt="Logo Mine" className="acc-hero-img" />
          </div>

          {/* ── KPI ──────────────────────────────────────────────────────── */}
          <div className="acc-kpi-grid">
            {[
              {
                icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>),
                bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#15803d",
                label: "Volume Sauté", value: totalVolume.toLocaleString(), unit: "t", delay: "0.10s",
              },
              {
                icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
                bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#16a34a",
                label: "Coups ", value: totalCoups.toLocaleString(), unit: "", delay: "0.18s",
              },
              {
                icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
                bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#15803d",
                label: "Heurs de marche", value: totalTemps.toLocaleString(), unit: "h", delay: "0.26s",
              },
              {
                icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>),
                bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#16a34a",
                label: "Rendement Moy.", value: rendMoyen, unit: "t/h", delay: "0.34s",
              },
              {
                icon: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
                bg: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#15803d",
                label: "En Marche", value: enMarcheCnt.toLocaleString(), unit: "", delay: "0.50s",
              },
            ].map(({ icon, bg, color, label, value, unit, delay }) => (
              <div key={label} className="acc-kpi" style={{ animationDelay: delay }}>
                <div className="acc-kpi-icon" style={{ background: bg, color }}>{icon}</div>
                <div className="acc-kpi-label">{label}</div>
                <div className="acc-kpi-value">{value}<span className="acc-kpi-unit">{unit}</span></div>
              </div>
            ))}
          </div>

          {/* ── Navigation cards ─────────────────────────────────────────── */}
          <div className="acc-section">Navigation rapide</div>
          <div className="acc-nav-grid">
            {navCards.map(({ icon, title, path, desc }, i) => (
              <div
                key={title}
                className="acc-nav-card"
                style={{ animationDelay: `${0.12 + i * 0.08}s` }}
                onClick={() => navigate(path)}
              >
                <div className="acc-nav-card-icon">{icon}</div>
                <div className="acc-nav-card-title">{title}</div>
                <div className="acc-nav-card-desc">{desc}</div>
                <div className="acc-nav-card-arrow">Accéder →</div>
              </div>
            ))}
          </div>

          {/* ── Dernières opérations ─────────────────────────────────────── */}

          {/* ── Info équipements ─────────────────────────────────────────── */}
          <div className="acc-section">Équipements disponibles</div>
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #bbf7d0",
              borderRadius: 16,
              padding: "20px 22px",
              opacity: 0,
              animation: "acc-fadeUp 0.55s ease 0.6s forwards",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["7500M1", "7500M2", "P&H1", "P&H2", "200B1"].map((eq) => (
                <div
                  key={eq}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 20,
                    background: "linear-gradient(135deg,#dcfce7,#bbf7d0)",
                    border: "1.5px solid #86efac",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#14532d",
                    fontFamily: "'DM Mono',monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  {eq}
                </div>
              ))}
            </div>
            <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
              Ces équipements sont sélectionnables lors de la saisie. D'autres
              peuvent être ajoutés dynamiquement.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardCasement;