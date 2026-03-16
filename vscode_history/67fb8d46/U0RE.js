import React, { useState } from "react";
import EtudiaLanding from "./components/EtudiaLanding";
import EtudiaSelection from "./components/EtudiaSelection";
import EtudiaModules from "./components/EtudiaModules";

function App() {
  const [selection, setSelection] = useState(null);

  return (
    <div>
      <EtudiaLanding />

      <EtudiaSelection onContinue={setSelection} />

      <EtudiaModules selection={selection} />
    </div>
  );
}

export default App;
