import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/Header.css";
import { useAuth } from "../../components/AuthContext";
import logo from "../../images/logo.png";
import ocpLogo from "../../images/ocpLogo.png";

const Header = ({ children }) => {   // ← children optionnel
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo-icon">
          <img src={logo} alt="Logo" style={{ width: "50px", height: "auto" }} />
        </div>
        <span className="logo-text">BGstripping</span>
      </div>

      {/* Burger mobile — affiché seulement si une navbar est passée */}
      {children && (
        <button
          className="navbar-toggler"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <>
                <line x1="18" y1="6"  x2="6"  y2="18" />
                <line x1="6"  y1="6"  x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      )}

      {/* Nav + Actions */}
      <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>

        {/* ← Navbar injectée uniquement depuis la page d'accueil */}
        {children && React.cloneElement(children, { closeMenu })}

        <div className="header-actions">

          {/* Toggle Thème */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le mode">
            {theme === "dark" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1"  x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1"  y1="12" x2="3"  y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
                <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Avatar + Nom utilisateur */}
          {user && (
            <div className="user-info" title={user.name}>
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="user-name">{user.name}</span>
            </div>
          )}

          {/* Bouton Déconnexion */}
          <button className="deconnexion-btn" onClick={handleLogout}>
            
            Déconnexion
          </button>

          <img src={ocpLogo} alt="OCP Logo" className="logo-ocp" />
        </div>
      </div>
    </header>
  );
};

export default Header;