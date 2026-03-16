import React, { useState } from "react";
import EtudiaLanding from "./components/EtudiaLanding";
import EtudiaSelection from "./components/EtudiaSelection";
import EtudiaModules from "./components/EtudiaModules";

function App() {
  const [selection, setSelection] = useState(null);

  return (
    <div className="app">

      <div className="top-area">
        <EtudiaLanding />
        <EtudiaSelection onContinue={setSelection} />
      </div>

      <div className="modules-area">
        {selection && (
          <EtudiaModules selection={selection} />
        )}
      </div>

    </div>
  );
}

export default App;
