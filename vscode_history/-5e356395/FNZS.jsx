import React from 'react';
import Presentation from './presentation'; // Assure-toi que le chemin est correct

function App() {
  const personnes = [
    { nom: "Rami", prenom: "Ahmed" },
    { nom: "Kamali", prenom: "Ali" },
    { nom: "Fahmi", prenom: "Khalid" }
  ];

  return (
    <div>
      {personnes.map((p, i) => (
        <Presentation key={i} personne={p} />
      ))}
    </div>
  );
}

export default App;
