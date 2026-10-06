import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import image from "../../images/image3.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD POUSSAGE — Page d'accueil du module
   Même design que DashboardCasement (hero + KPI + navigation rapide)
   Les graphes / tableaux / formulaires sont retirés : chaque page a son lien.
═══════════════════════════════════════════════════════════════════════════ */

/* ── Chemins des pages (selon les <Route> du composant Poussage) ───────────
   BASE = chemin où le composant <Poussage /> est monté dans votre App.
   Changez-le si votre route parente est différente.                        */
const BASE = "/operations/poussage";

const ROUTES = {
  saisie:      `${BASE}/Dashboard`,
  statistique: `${BASE}/Statistique`,
  historique:  `${BASE}/historique`,
  couts:       `${BASE}/Cout`,
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  @keyframes acc-fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes acc-shimmer   { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes acc-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes acc-stripe    { from{background-position:0%} to{background-position:200%} }

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

  @media (max-width: 640px) {
    .acc-hero { grid-template-columns: 1fr; padding: 24px 20px; }
    .acc-hero-img { display: none; }
    .acc-root { padding: 20px 16px 48px; }
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
  .acc-kpi:hover .acc-kpi-icon { transform: scale(1.1) rotate(-4deg); box-shadow: 0 8px 24px rgba(22,163,74,0.28); }
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
    color: #15803d;
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
`;

/* ── Calcul de la plage horaire (utilisé comme base HTP si htp non saisi) ── */
function calcPlage(p) {
  const debut = (p.heureDebut || "").substring(0, 5);
  const fin = (p.heureFin || "").substring(0, 5);
  if (!debut || !fin) return 0;
  const [dh, dm] = debut.split(":").map(Number);
  const [fh, fm] = fin.split(":").map(Number);
  let mins = fh * 60 + fm - (dh * 60 + dm);
  if (mins < 0) mins += 24 * 60;
  return parseFloat((mins / 60).toFixed(2));
}

function DashboardComplet() {
  const navigate = useNavigate();
  const poussages = useSelector((s) => s.poussage?.list || []);

  /* ── Statistiques ── */
  const totalOps = poussages.length;

  const totalVolume = poussages.reduce((a, p) => {
    const v = Number(p.volume_soté);
    return a + (isNaN(v) ? 0 : v);
  }, 0);

  const totalTemps = poussages.reduce((a, p) => a + Number(p.temps || 0), 0);

  const rendMoyen =
    totalOps > 0
      ? (
          poussages.reduce((a, p) => {
            const v = Number(p.volume_soté || 0);
            const t = Number(p.temps || 0);
            return a + (t > 0 ? v / t : 0);
          }, 0) / totalOps
        ).toFixed(1)
      : 0;

  const enMarcheCnt = poussages.filter((p) => p.etatMachine === "En marche").length;
  const enArretCnt = poussages.filter((p) => p.etatMachine === "En arrêt").length;

  /* OEE = TU × (1 − TD/100) */
  const totalHTP = poussages.reduce((a, p) => {
    const htp = Number(p.htp || 0);
    return a + (htp > 0 ? htp : calcPlage(p));
  }, 0);
  const totalHeuresArret = poussages.reduce((a, p) => a + Number(p.heures_arret || 0), 0);
  const tu = totalHTP > 0 ? (totalTemps / totalHTP) * 100 : 0;
  const td = totalHTP > 0 ? (totalHeuresArret / totalHTP) * 100 : 0;
  const oee = totalHTP > 0 ? (tu * (1 - td / 100)).toFixed(1) : "0.0";

  const ico = (children) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  );

  /* ── Cartes de navigation (liens vers les autres pages) ── */
  const navCards = [
    {
      icon: ico(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>),
      title: "Saisie Poussage",
      path: ROUTES.saisie,
      desc: "Saisie des opérations de poussage. Formulaire complet avec calcul automatique du rendement.",
    },
    {
      icon: ico(<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>),
      title: "Statistiques",
      path: ROUTES.statistique,
      desc: "Graphes de volume par engin et par tranchée. OEE, TU, TD et analyse des performances.",
    },
    {
      icon: ico(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>),
      title: "Historique",
      path: ROUTES.historique,
      desc: "Tableau filtrable de toutes les opérations enregistrées. Export Excel disponible.",
    },
    {
      icon: ico(<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>),
      title: "Coûts",
      path: ROUTES.couts,
      desc: "Suivi budgétaire. Calcul du coût mensuel et de la répartition annuelle.",
    },
  ];

  /* ── KPI ── */
  const kpis = [
    {
      icon: ico(<><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>),
      label: "Volume Total", value: totalVolume.toLocaleString(), unit: "t", delay: "0.10s",
    },
    {
      icon: ico(<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>),
      label: "Heures de marche", value: totalTemps.toLocaleString(), unit: "h", delay: "0.18s",
    },
    {
      icon: ico(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>),
      label: "Rendement Moy.", value: rendMoyen, unit: "t/h", delay: "0.26s",
    },
    {
      icon: ico(<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>),
      label: "En Marche", value: enMarcheCnt.toLocaleString(), unit: "", delay: "0.34s",
    },
    {
      icon: ico(<><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>),
      label: "En Arrêt", value: enArretCnt.toLocaleString(), unit: "", delay: "0.42s",
    },
    {
      icon: ico(<><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="M12 2a10 10 0 0 0-7.38 16.75"/><line x1="12" y1="12" x2="12" y2="8"/><circle cx="12" cy="12" r="1"/></>),
      label: "OEE", value: oee, unit: "%", delay: "0.50s",
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
                Gestion <span>Poussage</span> ZD11
              </h1>
              <p className="acc-hero-sub">
                Suivi des opérations de décapage par poussage — volumes, équipements,
                rendements, coûts et rapports en temps réel.
              </p>
              <div className="acc-hero-actions">
                <button className="acc-btn-primary" onClick={() => navigate(ROUTES.saisie)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Nouvelle saisie
                </button>
                <button className="acc-btn-secondary" onClick={() => navigate(ROUTES.statistique)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  Voir les statistiques
                </button>
              </div>
            </div>
            <img src={image} alt="Logo Mine" className="acc-hero-img" />
          </div>

          {/* ── KPI ──────────────────────────────────────────────────────── */}
          <div className="acc-kpi-grid">
            {kpis.map(({ icon, label, value, unit, delay }) => (
              <div key={label} className="acc-kpi" style={{ animationDelay: delay }}>
                <div
                  className="acc-kpi-icon"
                  style={{ background: "linear-gradient(145deg,#f0fdf4,#dcfce7)", color: "#15803d" }}
                >
                  {icon}
                </div>
                <div className="acc-kpi-label">{label}</div>
                <div className="acc-kpi-value">
                  {value}<span className="acc-kpi-unit">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Navigation rapide ────────────────────────────────────────── */}
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

          {/* ── Équipements disponibles ──────────────────────────────────── */}
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
              {["T1", "T2", "T3", "T4", "T5", "T6", "T7"].map((eq) => (
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

export default DashboardComplet;