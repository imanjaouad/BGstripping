import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCogs, FaChartBar, FaHistory } from "react-icons/fa";
import image from "../images/image.jpeg";
import "../components/animations.css";

function Sidebar() {
  return (
    <div className="sidebar-wrapper">

      {/* PARTICLES BACKGROUND */}
      <div className="sidebar-particles">
        <span className="particle particle-1"></span>
        <span className="particle particle-2"></span>
        <span className="particle particle-3"></span>
        <span className="particle particle-4"></span>
        <span className="particle particle-5"></span>
        <span className="particle particle-6"></span>
      </div>

      {/* LOGO */}
      <div className="sidebar-logo-area">

        <div className="logo-ring">
          <img
            src={image}
            alt="Logo Mine"
            className="sidebar-logo"
          />
        </div>

        <div className="sidebar-brand">
          <span className="brand-title">ZD11</span>
          <span className="brand-sub">Gestion Mine</span>
        </div>

      </div>

      <div className="sidebar-divider"></div>

      {/* NAVIGATION */}
      <ul className="sidebar-nav">

        <li className="sidebar-nav-item">
          <NavLink
            to="/DashboardComplet"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="nav-icon"><FaHome /></span>
            <span className="nav-label">Tableau de Bord</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </li>
         <li className="sidebar-nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="nav-icon"><FaHome /></span>
            <span className="nav-label">Gestion</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </li>


        <li className="sidebar-nav-item">
          <NavLink
            to="/statistique"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="nav-icon"><FaChartBar /></span>
            <span className="nav-label">Statistiques</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </li>

        <li className="sidebar-nav-item">
          <NavLink
            to="/historique"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="nav-icon"><FaHistory /></span>
            <span className="nav-label">Historique</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink
            to="/Cout"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="nav-icon"><FaHistory /></span>
            <span className="nav-label">Cout</span>
            <span className="nav-indicator"></span>
          </NavLink>
        </li>

      </ul>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <span className="footer-dot"></span>
        <span>Système actif</span>
      </div>

    </div>
  );
}

export default Sidebar;