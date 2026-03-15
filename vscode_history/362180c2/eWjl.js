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

  return (
    <div
      style={{
        background: theme === "light" ? "white" : "#111",
        color: theme === "light" ? "black" : "white",
        minHeight: "100vh"
      }}
    >
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Switch
      </button>

      <Timer />
      <Progress />
    </div>
  );
}
