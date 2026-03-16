import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import image from "../../images/image3.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   ACCUEIL CASEMENT  — Page d'accueil du module
   Style identique au reste du module (Plus Jakarta Sans, palette verte)
═══════════════════════════════════════════════════════════════════════════ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  @keyframes acc-fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes acc-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes acc-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes acc-pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 0 12px rgba(22,163,74,0)} }
  @keyframes acc-stripe    { from{background-position:0%} to{background-position:200%} }
  @keyframes acc-countUp   { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes acc-rowIn     { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }

  .acc-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: #f0fdf4;
    padding: 32px 28px 60px;
    color: #14532d;
    position: relative;
    overflow-x: hidden;
  }

  /* Decorative background */
  .acc-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 50% at 100% 0%,  rgba(220,252,231,0.6) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 0% 100%, rgba(187,247,208,0.35) 0%, transparent 55%);
  }
  .acc-dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(20,83,45,0.05) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 80%);
  }
  .acc-content { position: relative; z-index: 1; }

  /* ── Hero ── */
  .acc-hero {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 24px;
    background: #fff;
    border: 1.5px solid #bbf7d0;
    border-radius: 20px;
    padding: 32px 36px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
    opacity: 0; animation: acc-fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.05s forwards;
  }
  .acc-hero::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg,#14532d,#16a34a,#10b981,#16a34a,#14532d);
    background-size: 200% 100%; animation: acc-stripe 4s linear infinite;
  }
  .acc-hero-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.22em;
    text-transform: uppercase; color: #16a34a;
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .acc-hero-eyebrow::before {
    content: ''; width: 28px; height: 1.5px;
    background: linear-gradient(90deg,#16a34a,transparent);
  }
  .acc-hero-title {
    font-size: clamp(2rem,4vw,3rem); font-weight: 800;
    color: #14532d; line-height: 1.05; margin: 0 0 6px;
  }
  .acc-hero-title span {
    background: linear-gradient(135deg,#16a34a,#10b981);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .acc-hero-sub {
    font-size: 14px; color: #6b7280; margin: 0 0 24px; line-height: 1.6;
  }
  .acc-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .acc-hero-img {
    width: 120px; height: 120px; border-radius: 20px;
    border: 2px solid #bbf7d0; box-shadow: 0 8px 32px rgba(22,163,74,0.15);
    object-fit: cover; animation: acc-float 6s ease-in-out infinite;
  }

  /* ── Buttons ── */
  .acc-btn-primary {
    background: linear-gradient(135deg,#15803d,#16a34a);
    color: #fff; border: none; border-radius: 12px;
    padding: 12px 24px; font-size: 14px; font-weight: 700;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; box-shadow: 0 4px 14px rgba(22,163,74,0.3);
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .acc-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.35); }
  .acc-btn-secondary {
    background: #fff; color: #15803d;
    border: 1.5px solid #bbf7d0; border-radius: 12px;
    padding: 11px 22px; font-size: 14px; font-weight: 600;
    cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
    transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .acc-btn-secondary:hover { background: #f0fdf4; border-color: #16a34a; transform: translateY(-1px); }

  /* ── KPI cards ── */
  .acc-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 16px; margin-bottom: 28px; }
  .acc-kpi {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
    padding: 20px 20px; position: relative; overflow: hidden;
    opacity: 0; animation: acc-fadeUp 0.5s ease forwards;
    transition: transform 0.2s, box-shadow 0.2s; cursor: default;
  }
  .acc-kpi:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(22,163,74,0.12); }
  .acc-kpi::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size: 200%; animation: acc-shimmer 2.4s linear infinite;
  }
  .acc-kpi-icon {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(22,163,74,0.15), inset 0 1px 0 rgba(255,255,255,0.9);
    border: 1.5px solid rgba(134,239,172,0.6);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
    position: relative;
  }
  .acc-kpi-icon::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 18px;
    border: 1.5px solid rgba(22,163,74,0);
    transition: border-color 0.3s ease;
    pointer-events: none;
  }
  .acc-kpi:hover .acc-kpi-icon { transform: scale(1.1) rotate(-4deg); box-shadow: 0 8px 24px rgba(22,163,74,0.28); }
  .acc-kpi:hover .acc-kpi-icon::after { border-color: rgba(22,163,74,0.25); }
  .acc-kpi-label {
    font-size: 10px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 4px;
  }
  .acc-kpi-value { font-size: 28px; font-weight: 800; color: #15803d; line-height: 1; }
  .acc-kpi-unit  { font-size: 12px; font-weight: 500; color: #9ca3af; margin-left: 3px; }

  /* ── Nav cards ── */
  .acc-nav-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(240px,1fr)); gap: 18px; margin-bottom: 28px; }
  .acc-nav-card {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
    padding: 22px 22px; cursor: pointer;
    opacity: 0; animation: acc-fadeUp 0.55s ease forwards;
    transition: all 0.2s;
    display: flex; flex-direction: column; gap: 10px;
    text-decoration: none; color: inherit;
  }
  .acc-nav-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(22,163,74,0.14); border-color: #16a34a; }
  .acc-nav-card-icon {
    width: 50px; height: 50px; border-radius: 14px;
    background: linear-gradient(145deg,#f0fdf4,#dcfce7,#bbf7d0);
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid rgba(134,239,172,0.7);
    box-shadow: 0 0 0 5px rgba(220,252,231,0.4), 0 4px 14px rgba(22,163,74,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, background 0.3s ease;
  }
  .acc-nav-card:hover .acc-nav-card-icon {
    transform: scale(1.1) rotate(-4deg);
    background: linear-gradient(145deg,#dcfce7,#bbf7d0,#86efac);
    box-shadow: 0 0 0 7px rgba(187,247,208,0.45), 0 8px 24px rgba(22,163,74,0.25);
  }
  .acc-nav-card-title { font-size: 15px; font-weight: 700; color: #14532d; }
  .acc-nav-card-desc  { font-size: 12px; color: #9ca3af; line-height: 1.5; }
  .acc-nav-card-arrow {
    margin-top: auto; font-size: 11px; font-weight: 600;
    color: #16a34a; display: flex; align-items: center; gap: 4px;
  }

  /* ── Section title ── */
  .acc-section {
    font-size: 10px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
    color: #16a34a; margin: 0 0 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .acc-section::after { content:''; flex:1; height:1px; background:#bbf7d0; }

  /* ── Recent table ── */
  .acc-table-wrap { overflow-x:auto; border-radius:12px; border:1.5px solid #bbf7d0; }
  .acc-table { width:100%; border-collapse:collapse; font-size:12.5px; }
  .acc-table thead tr { background:#15803d; }
  .acc-table th { padding:11px 13px; text-align:left; font-size:10px; font-weight:700;
    letter-spacing:.07em; text-transform:uppercase; color:#fff; white-space:nowrap; }
  .acc-table tbody tr { border-bottom:1px solid #f0fdf4; animation:acc-rowIn .4s ease both; transition:background .15s; }
  .acc-table tbody tr:hover { background:#f0fdf4; }
  .acc-table tbody tr:last-child { border-bottom:none; }
  .acc-table td { padding:10px 13px; color:#374151; vertical-align:middle; white-space:nowrap; }
  .acc-table td:first-child { font-weight:600; color:#14532d; }
  .acc-badge-marche { background:#dcfce7;color:#15803d;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600; }
  .acc-badge-arret  { background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600; }

  /* ── Info card ── */
  .acc-info-card {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
    padding: 24px 22px; margin-bottom: 28px;
    opacity:0; animation: acc-fadeUp 0.55s ease 0.5s forwards;
  }

  /* ── Empty ── */
  .acc-empty { text-align:center; padding:40px 0; color:#9ca3af; font-size:13px; }
`;

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
      <style>{CSS}</style>
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
                label: "Temps Total", value: totalTemps.toLocaleString(), unit: "h", delay: "0.26s",
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