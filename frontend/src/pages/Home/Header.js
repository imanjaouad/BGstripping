import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/Header.css";
import { useAuth } from "../../components/AuthContext";
import logo from "../../images/logo.png";
import ocpLogo from "../../images/ocpLogo.png";

/**
 * Composant Header — barre de navigation principale de l'application.
 *
 * Props :
 *   - children : liens de navigation (ex. <NavLinks />) injectés depuis le parent.
 *                Si absent, le bouton burger ne s'affiche pas.
 *
 * Contexte utilisé (via useAuth) :
 *   - user        : objet utilisateur connecté (null si non connecté)
 *   - logout      : fonction de déconnexion
 *   - theme       : thème actif ("light" | "dark")
 *   - toggleTheme : bascule entre les deux thèmes
 */
const Header = ({ children }) => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  // État d'ouverture/fermeture du menu mobile (burger)
  const [isOpen, setIsOpen] = useState(false);

  // Déconnecte l'utilisateur et redirige vers la page de login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Ferme le menu mobile — passé en prop aux enfants pour fermer au clic d'un lien
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="header">

      {/* ── Logo principal (gauche) ── */}
      <div className="logo-container">
        <div className="logo-icon">
          <img src={logo} alt="Logo BGstripping" style={{ width: "50px", height: "auto" }} />
        </div>
        <span className="logo-text">BGstripping</span>
      </div>

      
      {/*
        ── Bouton burger (mobile uniquement) ──
        N'apparaît que si des liens de navigation (children) sont fournis.
        Affiche une icône ☰ quand fermé et une icône ✕ quand ouvert.
      */}
      {children && (
        <button
          className="navbar-toggler"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isOpen ? (
              /* Icône ✕ — menu ouvert */
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              /* Icône ☰ — menu fermé */
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      )}

      {/*
        ── Menu de navigation (collapse sur mobile) ──
        La classe "show" est ajoutée dynamiquement pour afficher le menu
        lorsque l'utilisateur clique sur le bouton burger.
      */}
      <div className={`navbar-collapse ${isOpen ? "show" : ""}`}>

        {/*
          Injection des liens de navigation fournis par le parent.
          On clone l'élément pour lui passer la fonction closeMenu,
          permettant de fermer le menu au clic sur un lien (UX mobile).
        */}
        {children && React.cloneElement(children, { closeMenu })}

        {/* ── Actions utilisateur (droite du header) ── */}
        <div className="header-actions">

          {/*
            ── Bouton bascule de thème ──
            CORRECTION : le SVG du mode "light" (soleil) était vide.
            Ajout des rayons et du cercle central pour représenter correctement le soleil.
          */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Changer le mode"
          >
            {theme === "dark" ? (
              /* Icône Soleil — thème sombre actif → cliquer pour passer en clair */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1"  x2="12" y2="3"  />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1"  y1="12" x2="3"  y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Icône Lune — thème clair actif → cliquer pour passer en sombre */
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/*
            ── Bouton "Se connecter" ──
            Affiché uniquement si aucun utilisateur n'est connecté.
          */}
          {!user && (
            <Link to="/login">
              <button className="connexion-btn">Se connecter</button>
            </Link>
          )}

          {/*
            ── Informations de l'utilisateur connecté ──
            Affiche un avatar SVG générique et le nom de l'utilisateur.
            L'attribut title permet de voir le nom complet en survol.
          */}
          {user && (
            <div className="user-info" title={user.name}>
              <div className="user-avatar">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="user-name">{user.name}</span>
            </div>
          )}

          {/*
            ── Bouton "Déconnexion" ──
            Affiché uniquement si un utilisateur est connecté.
            Appelle handleLogout qui vide la session et redirige vers /login.
          */}
          {user && (
            <button className="deconnexion-btn" onClick={handleLogout}>
              Déconnexion
            </button>
          )}

        </div>
        
      </div>
      {/*
        ── Logo OCP (toujours visible, y compris sur mobile) ──
        Placé ici, EN DEHORS du navbar-collapse, afin qu'il reste
        affiché quelle que soit la taille de l'écran.
      */}
      <img src={ocpLogo} alt="OCP Logo" className="logo-ocp" />

    </header>
  );
};

export default Header;