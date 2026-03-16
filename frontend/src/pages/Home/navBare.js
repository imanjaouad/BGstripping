import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ closeMenu }) => {
  return (
    <nav className="navbar">
      <Link to="/operations/poussage"  className="nav-link" onClick={closeMenu}>Poussage</Link>
      <Link to="/operations/casement"  className="nav-link" onClick={closeMenu}>Casement</Link>
      <Link to="/transport" className="nav-link" onClick={closeMenu}>Transport</Link>
      <Link to="/reports"   className="nav-link" onClick={closeMenu}>Reports</Link>
    </nav>
  );
};

export default Navbar;