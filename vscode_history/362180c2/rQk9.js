import React, { createContext, useContext, useState } from "react";
import Timer from "./components/timer";
import Progress from "./components/Progress";

const ThemeContext = createContext();

export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Content />
    </ThemeContext.Provider>
  );
}

function Content() {
  const { theme, setTheme } = useContext(ThemeContext);

  const buttonStyle = {
    padding: "10px 20px",
    margin: "20px 0",
    backgroundColor: theme === "light" ? "#111" : "#fff",
    color: theme === "light" ? "#fff" : "#111",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s"
  };

  const sidebarStyle = {
    width: "200px",
    backgroundColor: theme === "light" ? "#f0f0f0" : "#222",
    color: theme === "light" ? "#111" : "#fff",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  };

  const containerStyle = {
    display: "flex"
  };

  const mainStyle = {
    flex: 1,
    padding: "20px",
    background: theme === "light" ? "#fff" : "#111",
    color: theme === "light" ? "#000" : "#fff",
    minHeight: "100vh"
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Menu</h3>
        <button style={buttonStyle} onClick={() => alert("Option 1")}>
          Option 1
        </button>
        <button style={buttonStyle} onClick={() => alert("Option 2")}>
          Option 2
        </button>
        <button style={buttonStyle} onClick={() => alert("Option 3")}>
          Option 3
        </button>
        <button
          style={buttonStyle}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          Switch Theme
        </button>
      </div>

      {/* Main content */}
      <div style={mainStyle}>
        <Timer />
        <Progress />
      </div>
    </div>
  );
}
