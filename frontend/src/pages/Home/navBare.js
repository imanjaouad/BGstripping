import React from "react";

const Navbar = ({ closeMenu }) => {
  return (
    <nav className="navbar">
      <a href="#poussage"  className="nav-link" onClick={closeMenu}>Poussage</a>
      <a href="#casement"  className="nav-link" onClick={closeMenu}>Casement</a>
      <a href="#transport" className="nav-link" onClick={closeMenu}>Transport</a>
      <a href="#reports"   className="nav-link" onClick={closeMenu}>Reports</a>
    </nav>
  );
};

export default Navbar;