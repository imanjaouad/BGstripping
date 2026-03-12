import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import image from "../images/image.jpeg";
import {
  FaHome,
  FaChartBar,
  FaHistory,
  FaBars,
  FaArrowLeft,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";

/* ─────────────────────────────────────────
   SIDEBAR STYLE
───────────────────────────────────────── */

const SIDEBAR_CSS = `
.sb-wrapper{
position:fixed;
top:0;
left:0;
bottom:0;
background:linear-gradient(180deg,#169142,#16AC4D,#4CB069);
display:flex;
flex-direction:column;
transition:width .3s;
overflow:hidden;
z-index:100;
}

.sb-wrapper.open{width:240px;}
.sb-wrapper.closed{width:70px;}

.sb-toggle{
position:absolute;
top:20px;
right:-14px;
background:white;
border-radius:50%;
width:28px;
height:28px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
box-shadow:0 2px 8px rgba(0,0,0,0.15);
}
.logo-ring {
  border-radius: 50%;
  width:80px;
  padding: 4px;
  background: conic-gradient(from 0deg, #16A34A, #22C55E, #F59E0B, #16A34A);
  animation: rotateBorder 5s linear infinite;
  box-shadow: 0 0 22px var(--green-glow);
}
.sb-logo{
width: 80px; height: 80px; border-radius: 50%;
text-align:center;
  object-fit: cover; display: block;
  border: 3px solid #feffff;
}
  @keyframes rotateBorder {
  from { filter: hue-rotate(0deg); }
  to   { filter: hue-rotate(360deg); }
}

.sb-nav{
list-style:none;
padding:10px;
margin:0;
flex:1;
}

.sb-link{
display:flex;
align-items:center;
gap:12px;
padding:10px 12px;
border-radius:8px;
text-decoration:none;
color:white;
font-size:14px;
margin-bottom:6px;
transition:all .2s;
}

.sb-link:hover{
background:rgba(255,255,255,0.15);
}

.sb-link.active{
background:white;
color:#15803d;
font-weight:600;
}

.sb-icon{
width:28px;
display:flex;
justify-content:center;
}

.sb-footer{
padding:15px;
border-top:1px solid rgba(255,255,255,0.2);
}

.app-layout{
display:flex;
min-height:100vh;
}

.app-layout.open .main-content{margin-left:240px;}
.app-layout.closed .main-content{margin-left:70px;}

.main-content{
flex:1;
padding:30px;
transition:margin-left .3s;
}
`;

/* ─────────────────────────────────────────
   NAVIGATION LINKS
───────────────────────────────────────── */

const BASE = "/poussage";

const NAV_ITEMS = [
  {
    to: BASE,
    end: true,
    icon: <FaStar />,
    label: "Accueil",
  },

  

  {
    to: `${BASE}/Dashboardcomplet`,
    icon: <FaHome />,
    label: "Tablau de Bord",
  },
  {
    to: `${BASE}/Dashboard`,
    icon: <FaHome />,
    label: "Gestion",
  },

  {
    to: `${BASE}/Statistique`,
    icon: <FaChartBar />,
    label: "Statistiques",
  },

  {
    to: `${BASE}/historique`,
    icon: <FaHistory />,
    label: "Historique",
  },

  {
    to: `${BASE}/Cout`,
    icon: <FaMoneyBillWave />,
    label: "Coûts",
  },
];

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{SIDEBAR_CSS}</style>

      <div className={isOpen ? "sb-wrapper open" : "sb-wrapper closed"} >
        
        {/* Toggle */}
        <div className="sb-toggle" onClick={toggleSidebar}>
          <FaBars />
        </div>

        {/* Logo */}
         <div className="sb-csm-logo-area "  >
          <div className="logo-ring">
            <img src={image} alt="Logo Mine" className="sb-logo" />
          </div> </div>

        {/* Navigation */}
        <ul className="sb-nav">
          {NAV_ITEMS.map(({ to, icon, label, end }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive ? "sb-link active" : "sb-link"
                }
              >
                <span className="sb-icon">{icon}</span>
                {isOpen && label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sb-footer">
          <button
            onClick={() => navigate("/")}
            style={{
              background: "white",
              border: "none",
              padding: "8px 10px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            <FaArrowLeft /> {isOpen && "Retour Accueil"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;