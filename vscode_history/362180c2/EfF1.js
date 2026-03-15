import React, { createContext, useContext, useState } from "react";

// Création du ThemeContext
const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Page() {
  const { theme, setTheme } = useContext(ThemeContext);

  const pageStyle = {
    background: theme === "light" ? "#f9f9f9" : "#121212",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: theme === "light" ? "#eee" : "#1e1e1e"
  };

  const menuStyle = {
    display: "flex",
    gap: "20px",
    fontWeight: "bold",
    cursor: "pointer"
  };

  const containerStyle = {
    display: "flex",
    flex: 1
  };

  const sidebarStyle = {
    width: "200px",
    background: theme === "light" ? "#ddd" : "#222",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  };

  const buttonStyle = {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: theme === "light" ? "#111" : "#fff",
    color: theme === "light" ? "#fff" : "#111",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const mainStyle = {
    flex: 1,
    padding: "20px"
  };

  const footerStyle = {
    textAlign: "center",
    padding: "10px",
    background: theme === "light" ? "#eee" : "#1e1e1e"
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <button
          style={buttonStyle}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Switch Theme
        </button>
        <nav style={menuStyle}>
          <div>Home</div>
          <div>Product</div>
          <div>About Us</div>
        </nav>
      </header>

      {/* Body */}
      <div style={containerStyle}>
        {/* Sidebar */}
        <aside style={sidebarStyle}>
          <div>Home</div>
          <div>About Us</div>
          <div>Contact</div>
        </aside>

        {/* Main content */}
        <main style={mainStyle}>
          <h1>My App</h1>
          <p>
            "My App est une interface moderne avec sidebar, menu, contenu principal et footer, permettant de basculer facilement entre le mode clair et sombre pour une expérience utilisateur optimale.
          </p>
        </main>
      </div>

      {/* Footer */}
      <footer style={footerStyle}>
        &copy; 2025 My Company. All rights reserved.
      </footer>
    </div>
  );
}
