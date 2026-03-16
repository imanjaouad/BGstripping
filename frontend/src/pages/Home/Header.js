import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/Header.css";
import { useAuth } from "../../components/AuthContext";
import logo from "../../images/logo.png";
import ocpLogo from "../../images/ocpLogo.png";

const Header = ({ children }) => {
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

      {/* Burger mobile */}
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      )}

      <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>
        
        {children && React.cloneElement(children, { closeMenu })}

        <div className="header-actions">

          {/* Toggle Theme */}
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Se connecter */}
          {!user && (
            <Link to="/login">
              <button className="connexion-btn">
                Se connecter
              </button>
            </Link>
          )}

          {/* User info */}
          {user && (
            <div className="user-info" title={user.name}>
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="user-name">{user.name}</span>
            </div>
          )}

          {/* Logout */}
          {user && (
            <button className="deconnexion-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          )}

          <img src={ocpLogo} alt="OCP Logo" className="logo-ocp" />

        </div>
      </div>
    </header>
  );
};

export default Header;