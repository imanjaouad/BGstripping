import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
// ── SVG nav icons ─────────────────────────────────────────────────────────────
import image from "../images/image.jpeg";

const IcoHome    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoDash    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IcoEdit    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoChart   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const IcoStats   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const IcoHistory = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>;
const IcoMoney   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoBack    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;

const SIDEBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

  @keyframes sb-slide  { from{transform:translateX(-24px);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes sb-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes sb-glow   { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 18px 4px rgba(22,163,74,0.22)} }
  @keyframes sb-drift  {
    0%   { transform: translateY(0)   translateX(0)   scale(1); opacity:.18; }
    33%  { transform: translateY(-14px) translateX(6px)  scale(1.1); opacity:.28; }
    66%  { transform: translateY(4px)  translateX(-8px) scale(.95); opacity:.14; }
    100% { transform: translateY(0)   translateX(0)   scale(1); opacity:.18; }
  }

  /* ── Wrapper ── */
  .sb-csm-wrapper {
    height: 100vh;
    background: linear-gradient(175deg, #052e16 0%, #14532d 55%, #166534 100%);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0;
    overflow: hidden;
    box-shadow: 4px 0 32px rgba(0,0,0,0.22);
    font-family: 'Plus Jakarta Sans', sans-serif;
    z-index: 100;
    transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .sb-csm-wrapper.open   { width: 230px; }
  .sb-csm-wrapper.closed { width: 68px;  }

  /* ── Particles ── */
  .sb-csm-particles { position:absolute; inset:0; pointer-events:none; overflow:hidden; }
  .sb-csm-particle {
    position:absolute; border-radius:50%;
    background:radial-gradient(circle,rgba(74,222,128,.35),transparent 70%);
    animation: sb-drift linear infinite;
  }
  .sb-csm-particle:nth-child(1){ width:90px;  height:90px;  top:8%;    left:-20px; animation-duration:7s; }
  .sb-csm-particle:nth-child(2){ width:60px;  height:60px;  top:35%;   right:-10px; animation-duration:9s;  animation-delay:1.5s; }
  .sb-csm-particle:nth-child(3){ width:110px; height:110px; bottom:18%;left:10px;  animation-duration:11s; animation-delay:3s; }
  .sb-csm-particle:nth-child(4){ width:50px;  height:50px;  bottom:8%; right:20px; animation-duration:8s;  animation-delay:2s; }

  /* ── Logo area ── */
  .sb-csm-logo-area {
    display:flex; flex-direction:column; align-items:center;
    padding: 24px 16px 16px;
    position: relative; z-index:1;
    cursor: pointer;
  }
  .sb-csm-logo-ring {
    width:64px; height:64px; border-radius:50%;
    background:rgba(255,255,255,0.08);
    border:2px solid rgba(74,222,128,0.35);
    display:flex; align-items:center; justify-content:center;
    animation: sb-glow 3s ease-in-out infinite;
    margin-bottom:8px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .sb-csm-logo-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
  .sb-csm-brand-title { font-size:15px; font-weight:800; color:#fff; letter-spacing:.06em; white-space:nowrap; }
  .sb-csm-brand-sub   {
    font-size:10px; font-weight:600; color:rgba(74,222,128,0.75);
    letter-spacing:.12em; text-transform:uppercase; margin-top:2px; white-space:nowrap;
  }

  /* ── Divider ── */
  .sb-csm-divider {
    margin: 4px 20px 12px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(74,222,128,.4), transparent);
    position: relative; z-index:1;
    flex-shrink: 0;
  }

  /* ── Section label ── */
  .sb-csm-section-label {
    font-size:9px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
    color:rgba(74,222,128,0.65); padding:0 18px 8px;
    position: relative; z-index:1;
    white-space:nowrap; overflow:hidden;
  }

  /* ── Nav ── */
  .sb-csm-nav { list-style:none; padding:0 8px; margin:0; flex:1; position:relative; z-index:1; overflow-y:auto; overflow-x:hidden; }
  .sb-csm-nav::-webkit-scrollbar { width:3px; }
  .sb-csm-nav::-webkit-scrollbar-thumb { background:rgba(74,222,128,0.2); border-radius:2px; }

  .sb-csm-nav-item { margin-bottom:4px; animation:sb-slide .4s ease both; }
  .sb-csm-nav-item:nth-child(1){ animation-delay:.05s }
  .sb-csm-nav-item:nth-child(2){ animation-delay:.10s }
  .sb-csm-nav-item:nth-child(3){ animation-delay:.15s }
  .sb-csm-nav-item:nth-child(4){ animation-delay:.20s }
  .sb-csm-nav-item:nth-child(5){ animation-delay:.25s }
  .sb-csm-nav-item:nth-child(6){ animation-delay:.30s }

  .sb-csm-link {
    display:flex; align-items:center; gap:10px;
    padding:9px 10px; border-radius:11px;
    text-decoration:none; color:rgba(255,255,255,0.72);
    font-size:13px; font-weight:600;
    transition:all .18s; position:relative; overflow:hidden;
    white-space:nowrap;
  }
  .sb-csm-link:hover {
    background:rgba(255,255,255,0.09);
    color:#fff;
    transform:translateX(3px);
  }
  .sb-csm-link.active {
    background:rgba(255,255,255,0.14);
    color:#4ade80;
    box-shadow:inset 2px 0 0 #4ade80;
  }

  .sb-csm-nav-icon {
    width:30px; height:30px; border-radius:8px;
    background:rgba(255,255,255,0.08);
    display:flex; align-items:center; justify-content:center;
    font-size:14px; flex-shrink:0;
    transition:background .18s;
    color: rgba(255,255,255,0.72);
  }
  .sb-csm-link:hover .sb-csm-nav-icon,
  .sb-csm-link.active .sb-csm-nav-icon {
    background:rgba(74,222,128,0.18);
    color:#4ade80;
  }

  .sb-csm-nav-label { font-size:13px; white-space:nowrap; overflow:hidden; }

  .sb-csm-nav-indicator {
    margin-left:auto; width:6px; height:6px; border-radius:50%;
    background:#4ade80; opacity:0; transform:scale(0); transition:all .18s; flex-shrink:0;
  }
  .sb-csm-link.active .sb-csm-nav-indicator { opacity:1; transform:scale(1); }

  /* ── Back button ── */
  .sb-csm-back {
    display:flex; align-items:center; gap:10px;
    padding:9px 10px; margin:0 8px 4px;
    border-radius:11px; background:none; border:none; cursor:pointer;
    color:rgba(255,255,255,0.55); font-family:'Plus Jakarta Sans', sans-serif;
    font-size:13px; font-weight:600;
    transition:all .18s; white-space:nowrap; overflow:hidden;
    text-align:left; width:calc(100% - 16px);
    position: relative; z-index:1;
  }
  .sb-csm-back:hover { background:rgba(255,255,255,0.09); color:#fff; }
  .sb-csm-back-icon {
    width:30px; height:30px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.6);
    font-size:13px; flex-shrink:0;
    transition:background .18s;
  }
  .sb-csm-back:hover .sb-csm-back-icon { background:rgba(74,222,128,0.18); color:#4ade80; }

  /* ── Footer ── */
  .sb-csm-footer {
    padding:14px 20px; border-top:1px solid rgba(74,222,128,0.12);
    display:flex; align-items:center; gap:8px;
    position:relative; z-index:1; flex-shrink:0;
    overflow:hidden;
  }
  .sb-csm-footer-dot {
    width:7px; height:7px; border-radius:50%; background:#4ade80;
    box-shadow:0 0 8px #4ade80; flex-shrink:0;
    animation:sb-float 2.5s ease-in-out infinite;
  }
  .sb-csm-footer-text { font-size:11px; color:rgba(255,255,255,0.5); font-weight:600; white-space:nowrap; }

  /* ── Main layout ── */
  .app-layout { display:flex; min-height:100vh; }
  .app-layout.open   .main-content { margin-left: 230px; }
  .app-layout.closed .main-content { margin-left: 68px; }
  .main-content {
    flex:1; padding:28px 32px;
    transition:margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
    min-height:100vh;
  }
  @media (max-width:768px) {
    .app-layout.open   .main-content,
    .app-layout.closed .main-content { margin-left:0; }
    .sb-csm-wrapper { transform:translateX(-100%); }
    .sb-csm-wrapper.open { transform:translateX(0); }
  }
`;

const BASE = "/poussage";

const NAV_ITEMS = [
  { to: `${BASE}`,                  end: true, icon: <IcoHome />,    label: "Accueil"         },
  { to: `${BASE}/DashboardComplet`,            icon: <IcoDash />,    label: "Tableau de Bord" },
  { to: `${BASE}/Dashboard`,                   icon: <IcoEdit />,    label: "Gestion"         },
  { to: `${BASE}/Statistique`,                 icon: <IcoStats />,   label: "Statistiques"    },
  { to: `${BASE}/Historique`,                  icon: <IcoHistory />, label: "Historique"      },
  { to: `${BASE}/Cout`,                        icon: <IcoMoney />,   label: "Coût"            },
];

function SidebarCasement({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{SIDEBAR_CSS}</style>
      <div className={isOpen ? "sb-csm-wrapper open" : "sb-csm-wrapper closed"}>

        {/* Particles */}
        <div className="sb-csm-particles">
          <span className="sb-csm-particle" />
          <span className="sb-csm-particle" />
          <span className="sb-csm-particle" />
          <span className="sb-csm-particle" />
        </div>

        {/* Logo / Brand */}
        <div className="sb-csm-logo-area" onClick={toggleSidebar}>
          <div className="sb-csm-logo-ring">
            <img src={image} alt="Logo Mine" className="sb-csm-logo-img" />
          </div>
          {isOpen && (
            <>
              <div className="sb-csm-brand-title">ZD11</div>
              <div className="sb-csm-brand-sub">Gestion ZD11</div>
            </>
          )}
        </div>

        <div className="sb-csm-divider" />

        {/* Section label */}
        {isOpen && <div className="sb-csm-section-label">Navigation</div>}

        {/* Nav */}
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
                {isOpen && <span className="sb-csm-nav-indicator" />}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sb-csm-divider" />

        {/* Back to home */}
        <button className="sb-csm-back" onClick={() => navigate("/")}>
          <span className="sb-csm-back-icon">
            <IcoBack />
          </span>
          {isOpen && "Retour Accueil"}
        </button>

        {/* Footer */}
        <div className="sb-csm-footer">
          <div className="sb-csm-footer-dot" />
          {isOpen && <span className="sb-csm-footer-text">Système actif</span>}
        </div>

      </div>
    </>
  );
}

export default SidebarCasement;