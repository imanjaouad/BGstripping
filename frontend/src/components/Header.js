import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Header.css';
import logo from "../images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState('dark');

  // Get current user info
  const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.error("Logout API error:", err);
    }

    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-icon">
          <img src={logo} alt="Logo" style={{width:"90px",height:"75px",marginTop:"16px"}} />
        </div>
        <span className="logo-text">BGstripping</span>
      </div>

      <nav className="navbar">
        <a href="#poussage" className="nav-link">Poussage</a>
        <a href="#casement" className="nav-link">Casement</a>
        <a href="#transport" className="nav-link">Transport</a>
        <a href="#reports" className="nav-link">Reports</a>
        <a href="#statistics" className="nav-link">Statistiques</a>
      </nav>

      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le mode">
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {user && (
          <span style={{ color: "#10b981", fontWeight: 600, fontSize: 13 }}>
            {user.username}
          </span>
        )}

        <button className="deconnexion-btn" onClick={handleLogout}>Deconnexion</button>
        
        <div className="user-avatar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
