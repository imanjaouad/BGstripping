import React from "react";
import { NavLink } from "react-router-dom";
import { FaArrowLeft, FaTachometerAlt, FaChartLine } from "react-icons/fa";
import image from "../../images/image.jpeg";

// ─── CSS injected once ─────────────────────────────────────────────────────────
const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  @keyframes tr-slide  { from{transform:translateX(-24px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes tr-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes tr-glow   { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 18px 4px rgba(22,163,74,0.22)} }
  @keyframes tr-spin   { to{transform:rotate(360deg);} }
  @keyframes tr-drift  {
    0%   { transform: translateY(0)   translateX(0)   scale(1); opacity:.18; }
    33%  { transform: translateY(-14px) translateX(6px)  scale(1.1); opacity:.28; }
    66%  { transform: translateY(4px)  translateX(-8px) scale(.95); opacity:.14; }
    100% { transform: translateY(0)   translateX(0)   scale(1); opacity:.18; }
  }

  /* ── Wrapper ── */
  .tr-sidebar {
    width: 230px; min-width: 230px; height: 100vh;
    background: linear-gradient(175deg, #052e16 0%, #14532d 55%, #166534 100%);
    display: flex; flex-direction: column;
    position: sticky; top: 0;
    overflow: hidden;
    box-shadow: 4px 0 32px rgba(0,0,0,0.22);
    font-family: 'Plus Jakarta Sans', sans-serif;
    z-index: 100;
  }

  /* ── Particles ── */
  .tr-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
  .tr-particle {
    position:absolute; border-radius:50%;
    background:radial-gradient(circle,rgba(74,222,128,.35),transparent 70%);
    animation: tr-drift linear infinite;
  }
  .tr-particle:nth-child(1){ width:90px; height:90px; top:8%;  left:-20px; animation-duration:7s; }
  .tr-particle:nth-child(2){ width:60px; height:60px; top:35%; right:-10px; animation-duration:9s; animation-delay:1.5s; }
  .tr-particle:nth-child(3){ width:110px;height:110px;bottom:18%;left:10px; animation-duration:11s;animation-delay:3s; }
  .tr-particle:nth-child(4){ width:50px; height:50px; bottom:8%; right:20px; animation-duration:8s; animation-delay:2s; }

  /* ── Logo area ── */
  .tr-logo-area {
    display:flex; flex-direction:column; align-items:center;
    padding: 28px 16px 18px;
    position: relative; z-index:1;
  }
  .tr-logo-ring {
    width:72px; height:72px; border-radius:50%;
    background:rgba(255,255,255,0.08);
    border:2px solid rgba(74,222,128,0.35);
    display:flex; align-items:center; justify-content:center;
    animation: tr-glow 3s ease-in-out infinite;
    margin-bottom:10px;
  }
  .tr-logo-ring img {
    width:60px; height:60px; border-radius:50%; object-fit:cover;
  }
  .tr-brand-title { font-size:15px; font-weight:800; color:#fff; letter-spacing:.06em; }
  .tr-brand-sub   { font-size:10px; font-weight:600; color:rgba(74,222,128,0.75); letter-spacing:.12em; text-transform:uppercase; margin-top:2px; }

  /* ── Divider ── */
  .tr-divider {
    margin: 4px 20px 16px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(74,222,128,.4), transparent);
    position: relative; z-index:1;
  }

  /* ── Section label ── */
  .tr-section-label {
    font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
    color:rgba(74,222,128,0.65); padding:0 18px 8px;
    position: relative; z-index:1;
  }

  /* ── Nav ── */
  .tr-nav { list-style:none; padding:0 10px; margin:0; flex:1; position:relative; z-index:1; }
  .tr-nav-item { margin-bottom:4px; animation:tr-slide .4s ease both; }
  .tr-nav-item:nth-child(1){ animation-delay:.05s }
  .tr-nav-item:nth-child(2){ animation-delay:.10s }
  .tr-nav-item:nth-child(3){ animation-delay:.15s }
  .tr-nav-item:nth-child(4){ animation-delay:.20s }
  .tr-nav-item:nth-child(5){ animation-delay:.25s }

  .tr-link {
    display:flex; align-items:center; gap:10px;
    padding:9px 12px; border-radius:11px;
    text-decoration:none; color:rgba(255,255,255,0.72);
    font-size:13px; font-weight:600;
    transition:all .18s; position:relative; overflow:hidden;
    background: none; border: none; width: 100%; cursor: pointer;
  }
  .tr-link:hover {
    background:rgba(255,255,255,0.09);
    color:#fff;
    transform:translateX(3px);
  }
  .tr-link.active {
    background:rgba(255,255,255,0.14);
    color:#4ade80;
    box-shadow:inset 2px 0 0 #4ade80;
  }

  .tr-link-icon {
    width:30px; height:30px; border-radius:8px;
    background:rgba(255,255,255,0.08);
    display:flex; align-items:center; justify-content:center;
    font-size:13px; flex-shrink:0;
    transition:background .18s;
  }
  .tr-link:hover .tr-link-icon,
  .tr-link.active .tr-link-icon {
    background:rgba(74,222,128,0.18);
    color:#4ade80;
  }

  .tr-link-indicator {
    margin-left:auto; width:6px; height:6px; border-radius:50%;
    background:#4ade80; opacity:0; transform:scale(0); transition:all .18s;
  }
  .tr-link.active .tr-link-indicator { opacity:1; transform:scale(1); }

  /* ── Footer ── */
  .tr-footer {
    padding:14px 20px; border-top:1px solid rgba(74,222,128,0.12);
    display:flex; align-items:center; gap:8px;
    position:relative; z-index:1;
  }
  .tr-footer-dot {
    width:7px; height:7px; border-radius:50%; background:#4ade80;
    box-shadow:0 0 8px #4ade80; flex-shrink:0;
    animation:tr-float 2.5s ease-in-out infinite;
  }
  .tr-footer-text { font-size:11px; color:rgba(255,255,255,0.5); font-weight:600; }
`;

function TransportSidebar() {
  return (
    <>
      <style>{SIDEBAR_CSS}</style>
      <div className="tr-sidebar">
        {/* Particles */}
        <div className="tr-particles">
          <span className="tr-particle" />
          <span className="tr-particle" />
          <span className="tr-particle" />
          <span className="tr-particle" />
        </div>

        {/* Logo */}
        <div className="tr-logo-area">
          <div className="tr-logo-ring">
            <img src={image} alt="Logo Mine" />
          </div>
          <div className="tr-brand-title">ZD11</div>
          <div className="tr-brand-sub">Transport</div>
        </div>

        <div className="tr-divider" />

        {/* Section: Navigation */}
        <div className="tr-section-label">Navigation</div>
        <ul className="tr-nav">
          {/* Retour accueil */}
          <li className="tr-nav-item">
            <NavLink to="/" className="tr-link">
              <span className="tr-link-icon"><FaArrowLeft /></span>
              <span>Retour Accueil</span>
              <span className="tr-link-indicator" />
            </NavLink>
          </li>

          {/* Dashboard Transport */}
          <li className="tr-nav-item">
            <NavLink
              to="/transport"
              end
              className={({ isActive }) =>
                isActive ? "tr-link active" : "tr-link"
              }
            >
              <span className="tr-link-icon"><FaTachometerAlt /></span>
              <span>Tableau de Bord</span>
              <span className="tr-link-indicator" />
            </NavLink>
          </li>

          {/* Statistiques Transport */}
          <li className="tr-nav-item">
            <NavLink
              to="/transport/statistiques"
              className={({ isActive }) =>
                isActive ? "tr-link active" : "tr-link"
              }
            >
              <span className="tr-link-icon"><FaChartLine /></span>
              <span>Statistiques</span>
              <span className="tr-link-indicator" />
            </NavLink>
          </li>
        </ul>

        {/* Section: Entreprises */}
        <div className="tr-section-label" style={{ marginTop: 8 }}>Entreprises</div>
        <ul className="tr-nav" style={{ flex: "unset" }}>
          <li className="tr-nav-item">
            <button
              className="tr-link"
              onClick={() =>
                document.getElementById("section-procaneq")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <span className="tr-link-icon">🟧</span>
              <span>Procaneq</span>
            </button>
          </li>
          <li className="tr-nav-item">
            <button
              className="tr-link"
              onClick={() =>
                document.getElementById("section-transwine")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              <span className="tr-link-icon">🟦</span>
              <span>Transwine</span>
            </button>
          </li>
        </ul>

        {/* Footer */}
        <div className="tr-footer">
          <div className="tr-footer-dot" />
          <span className="tr-footer-text">Système actif</span>
        </div>
      </div>
    </>
  );
}

export default TransportSidebar;
