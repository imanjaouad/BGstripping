import React, { useState, useEffect } from "react";

export default function Navbar() {
  // 1. كنصاوبو state باش نعرفو واش إينا mode خدامين بيه
  const [theme, setTheme] = useState("light");

  // 2. هاد الـ useEffect غتبدل لينا الـ theme فـ الصفحة كاملة (html tag)
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  // 3. function باش نقلبو من light لـ dark والعكس
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    // بدلت navbar-dark بـ navbar-expand-md وبدلت الـ background باش يتناسب مع الـ theme
    <nav className={`navbar navbar-expand-md shadow ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-primary'}`}>
      <div className="container">
        
        {/* Logo */}
        <a className="navbar-brand fw-bold text-white" href="#">
          MyLogo
        </a>

        {/* Toggle Button (Mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link text-white" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#services">Services</a>
            </li>
            
            {/* Button Dark Mode */}
            <li className="nav-item ms-md-3">
              <button 
                className={`btn btn-sm ${theme === 'dark' ? 'btn-outline-warning' : 'btn-outline-light'}`} 
                onClick={toggleTheme}
              >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}