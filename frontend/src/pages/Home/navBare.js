import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ closeMenu }) => {

  // ✅ Lit depuis sessionStorage ET localStorage
  // (selon si "Se souvenir de moi" était coché ou non lors du login)
  const user =
    JSON.parse(sessionStorage.getItem("user")) ||
    JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <Link to="/operations/poussage" className="nav-link" onClick={closeMenu}>
        Poussage
      </Link>

      <Link to="/operations/casement" className="nav-link" onClick={closeMenu}>
        Casement
      </Link>

      <Link to="/operations/transport" className="nav-link" onClick={closeMenu}>
        Transport
      </Link>

      <Link to="/securite" className="nav-link" onClick={closeMenu}>
        Sécurité
      </Link>

      {/* ✅ Affiché uniquement pour l'admin */}
      {/* ✅ Route corrigée : /admin/users → /users (cohérent avec UserManagement) */}
      {isAdmin && (
        <Link to="/admin/users" className="nav-link" onClick={closeMenu}>
          Gestion des utilisateurs
        </Link>
      )}
    </nav>
  );
};

export default Navbar;