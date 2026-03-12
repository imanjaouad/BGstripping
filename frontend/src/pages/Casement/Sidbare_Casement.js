import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaHistory,
  FaBars,
  FaFileAlt,
  FaArrowLeft,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import image from "../../images/image.jpeg";

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR CASEMENT — Light Mode Premium
   Botanical Manuscript × Swiss Editorial
   v2: ajout Accueil + Coûts
═══════════════════════════════════════════════════════════════════════════ */

const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Epilogue:wght@500;600;700&display=swap');

  .sb-csm-wrapper {
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
    display: flex; flex-direction: column;
    background: linear-gradient(180deg,
 #169142 0%,
 #16AC4D 50%,
 #4CB069 100%
);
    border-right: 1.5px solid #bbf7d0;
    transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
    box-shadow: 4px 0 24px rgba(20,83,45,0.07), 2px 0 8px rgba(20,83,45,0.04);
  }
  .sb-csm-wrapper.open   { width: 240px; }
  .sb-csm-wrapper.closed { width: 68px;  }

  /* Top accent stripe */
  .sb-csm-wrapper::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, #14532d, #16a34a, #10b981, #16a34a, #14532d);
    background-size: 200% 100%;
    animation: sb-stripe 4s linear infinite;
  }
  @keyframes sb-stripe {
    from { background-position: 0%; }
    to   { background-position: 200%; }
  }

  /* Toggle button */
  .sb-csm-toggle {
    position: absolute; top: 60px; right: 150px;
    width: 28px; height: 28px; border-radius: 50%;
    background: #ffffff;
    border: 1.5px solid #bbf7d0;
    box-shadow: 0 2px 10px rgba(20,83,45,0.12);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10;
    color: #16a34a; font-size: 11px;
    transition: all 0.2s ease;
  }
  .sb-csm-toggle:hover {
    background: #f0fdf4; border-color: #16a34a;
    transform: scale(1.1); box-shadow: 0 4px 16px rgba(22,163,74,0.2);
  }

  /* Logo area */
  .sb-csm-logo-area {
    padding: 28px 16px 20px;
    display: flex; align-items: center; gap: 12px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(187,247,208,0.6);
    margin-bottom: 8px;
  }
  .sb-csm-logo-ring {
    width: 70px; height: 70px; border-radius: 12px;
    border: 2px solid #bbf7d0;
    box-shadow: 0 2px 12px rgba(22,163,74,0.15);
    overflow: hidden; flex-shrink: 0;
    background: #f0fdf4;
    display: flex; align-items: center; justify-content: center;
  }
  .sb-csm-logo-img { width: 100%; height: 100%; object-fit: cover; }
  .sb-csm-brand { overflow: hidden; white-space: nowrap; }
  .sb-csm-brand-title {
    font-family: 'Epilogue', sans-serif;
    font-size: 15px; font-weight: 700; color: #14532d; line-height: 1.1; display: block;
  }
  .sb-csm-brand-sub {
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 500; letter-spacing: 0.15em;
    text-transform: uppercase; color: #16a34a; display: block; margin-top: 2px;
  }

  /* Nav */
  .sb-csm-nav {
    list-style: none; padding: 8px 10px; margin: 0;
    flex: 1; overflow-y: auto; overflow-x: hidden;
  }
  .sb-csm-nav::-webkit-scrollbar { width: 3px; }
  .sb-csm-nav::-webkit-scrollbar-thumb { background: rgba(22,163,74,0.2); border-radius: 2px; }

  .sb-csm-nav-item { margin-bottom: 3px; }

  .sb-csm-nav-group-label {
    font-family: 'DM Mono', monospace;
    font-size: 8px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: #9ca3af; padding: 10px 10px 4px; display: block;
    white-space: nowrap; overflow: hidden;
  }

  .sb-csm-link {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px; text-decoration: none;
    color: #4b5563; font-family: 'Epilogue', sans-serif;
    font-size: 13px; font-weight: 500;
    transition: all 0.18s cubic-bezier(0.16,1,0.3,1);
    position: relative; overflow: hidden; white-space: nowrap;
  }
  .sb-csm-link:hover { background: #f0fdf4; color: #15803d; transform: translateX(2px); }
  .sb-csm-link.active {
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
    color: #15803d; font-weight: 600;
    border: 1.5px solid rgba(187,247,208,0.8);
    box-shadow: 0 2px 12px rgba(22,163,74,0.1);
  }
  /* Active left bar */
  .sb-csm-link.active::before {
    content: '';
    position: absolute; left: 0; top: 4px; bottom: 4px;
    width: 3px; border-radius: 0 2px 2px 0;
    background: linear-gradient(180deg, #14532d, #16a34a);
  }
  .sb-csm-nav-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    background: rgba(220,252,231,0.5); color: #16a34a;
    transition: all 0.18s ease;
  }
  .sb-csm-link.active .sb-csm-nav-icon {
    background: linear-gradient(135deg, #15803d, #16a34a);
    color: #fff; box-shadow: 0 2px 8px rgba(22,163,74,0.3);
  }
  .sb-csm-link:hover:not(.active) .sb-csm-nav-icon { background: #dcfce7; }
  .sb-csm-nav-label { font-size: 13px; white-space: nowrap; overflow: hidden; }

  /* Badge for nav items */
  .sb-csm-nav-badge {
    margin-left: auto; flex-shrink: 0;
    background: #dcfce7; color: #16a34a;
    font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 600; letter-spacing: 0.05em;
    padding: 2px 7px; border-radius: 20px;
    border: 1px solid #bbf7d0;
  }

  /* Divider */
  .sb-csm-divider { height: 1px; background: rgba(187,247,208,0.6); margin: 8px 16px; }

  /* Back button */
  .sb-csm-back {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; margin: 0 10px 4px;
    border-radius: 10px; background: none; border: none; cursor: pointer;
    color: #6b7280; font-family: 'Epilogue', sans-serif;
    font-size: 12px; font-weight: 500; transition: all 0.18s;
    white-space: nowrap; overflow: hidden;
    text-align: left; width: calc(100% - 20px);
  }
  .sb-csm-back:hover { background: #fafaf7; color: #374151; }
  .sb-csm-back-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6; color: #6b7280; font-size: 12px; flex-shrink: 0;
  }

  /* Footer */
  .sb-csm-footer { padding: 16px; border-top: 1px solid rgba(187,247,208,0.6); flex-shrink: 0; }
  .sb-csm-footer-inner {
    display: flex; align-items: center; gap: 8px; padding: 10px 12px;
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px;
    white-space: nowrap; overflow: hidden;
  }
  .sb-csm-footer-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.2);
    flex-shrink: 0; animation: sb-dot-pulse 2s ease infinite;
  }
  @keyframes sb-dot-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
    50%      { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
  }
  .sb-csm-footer-text {
    font-family: 'DM Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: #16a34a;
  }

  /* Main content offset */
  .app-layout { display: flex; min-height: 100vh; background: #fafaf7; }
  .app-layout.open   .main-content { margin-left: 240px; }
  .app-layout.closed .main-content { margin-left: 68px;  }
  .main-content {
    flex: 1; padding: 28px 32px;
    transition: margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
    min-height: 100vh;
  }
  @media (max-width: 768px) {
    .app-layout.open   .main-content,
    .app-layout.closed .main-content { margin-left: 0; }
    .sb-csm-wrapper { transform: translateX(-100%); }
    .sb-csm-wrapper.open { transform: translateX(0); }
  }
`;

/* ── Nav items definition ─────────────────────────────────────────────────── */
// ⚠️ CHEMINS ABSOLUS — correspond exactement aux routes dans App.js + casement.js
// App.js  : <Route path="/operations/casement/*" element={<Casement />} />
// casement.js : <Route index/>, "accueil", "statistique", "historique", "rapport", "couts"
const BASE = "/operations/casement";

const NAV_ITEMS = [
  { to: BASE, end: true, icon: <FaStar />, label: "Accueil", badge: null },
  {
    to: `${BASE}/dashboard`,
    icon: <FaHome />,
    label: "Tableau de Bord",
    badge: null,
  },
  {
    to: `${BASE}/statistique`,
    icon: <FaChartBar />,
    label: "Statistiques",
    badge: null,
  },
  {
    to: `${BASE}/historique`,
    icon: <FaHistory />,
    label: "Historique",
    badge: null,
  },
  { to: `${BASE}/rapport`, icon: <FaFileAlt />, label: "Rapport", badge: null },
  {
    to: `${BASE}/couts`,
    icon: <FaMoneyBillWave />,
    label: "Coûts",
    badge: "NEW",
  },
];

function SidebarCasement({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{SIDEBAR_CSS}</style>
      <div className={isOpen ? "sb-csm-wrapper open" : "sb-csm-wrapper closed"}>
        {/* Toggle button */}
        <div className="sb-csm-toggle" onClick={toggleSidebar}>
          <FaBars />
        </div>

        {/* Logo / Brand */}
        <div className="sb-csm-logo-area">
          <div className="sb-csm-logo-ring">
            <img src={image} alt="Logo Mine" className="sb-csm-logo-img" />
          </div>
          {isOpen && (
            <div className="sb-csm-brand">
              <span className="sb-csm-brand-title">ZD11</span>
              <span className="sb-csm-brand-sub">Casement</span>
            </div>
          )}
        </div>

        {/* Nav group label */}
        {isOpen && <span className="sb-csm-nav-group-label">Navigation</span>}

        {/* Navigation */}
        <ul className="sb-csm-nav">
          {NAV_ITEMS.map(({ to, end, icon, label, badge }) => (
            <li key={label} className="sb-csm-nav-item">
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive ? "sb-csm-link active" : "sb-csm-link"
                }
              >
                <span className="sb-csm-nav-icon">{icon}</span>
                {isOpen && <span className="sb-csm-nav-label">{label}</span>}
                {isOpen && badge && (
                  <span className="sb-csm-nav-badge">{badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sb-csm-divider" />

        {/* Back to home */}
        <button className="sb-csm-back" onClick={() => navigate("/")}>
          <span className="sb-csm-back-icon">
            <FaArrowLeft />
          </span>
          {isOpen && "Retour Accueil"}
        </button>

        {/* Footer */}
        <div className="sb-csm-footer">
          <div className="sb-csm-footer-inner">
            <span className="sb-csm-footer-dot" />
            {isOpen && (
              <span className="sb-csm-footer-text">Système actif</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SidebarCasement;
