import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ closeMenu }) => {

  const user = JSON.parse(sessionStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <Link to="/operations/poussage" className="nav-link" onClick={closeMenu}>
        Poussage
      </Link>

      <Link to="/operations/casement" className="nav-link" onClick={closeMenu}>
        Casement
      </Link>

      <Link to="/transport" className="nav-link" onClick={closeMenu}>
        Transport
      </Link>

      <Link to="/securite" className="nav-link" onClick={closeMenu}>
        Sécurité
      </Link>

      {/* 👇 غير للـ admin */}
      {isAdmin && (
        <Link to="/admin/users" className="nav-link" onClick={closeMenu}>
          Gestion des utilisateurs
        </Link>
      )}
    </nav>
  );
};

export default Navbar;