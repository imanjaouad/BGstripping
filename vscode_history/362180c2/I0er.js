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

  const buttonHover = (e) => {
    e.target.style.opacity = 0.8;
  };

  const buttonLeave = (e) => {
    e.target.style.opacity = 1;
  };

  return (
    <div
      style={{
        background: theme === "light" ? "white" : "#111",
        color: theme === "light" ? "black" : "white",
        minHeight: "100vh",
        padding: "20px"
      }}
    >
      <button
        style={buttonStyle}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        Switch
      </button>

      <Timer />
      <Progress />
    </div>
  );
}
