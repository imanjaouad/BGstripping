import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        {showSplash && <div className="blue-splash"></div>}
        <div className="logo-container">
          <span className="graduation-cap">🎓</span>
          <h1>Etudia</h1>
        </div>
        <p className="learn-more">Learn more</p>
      </div>

      <div className="header-bottom">
        <div className="welcome-text">
          <p>Bienvenue,</p>
          <p>Cher Apprenant,</p>
        </div>
        <div className="decorative-line"></div>
        <div className="mountains-container">
          <div className="mountain"></div>
          <div className="mountain"></div>
          <div className="mountain"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;