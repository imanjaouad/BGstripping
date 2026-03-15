import React, { useState } from "react";
import Produit from "./components/Produit";
import ListeProduits from "./components/ListeProduits";
import img1 from './images/image pc.png'
import img2 from './images/image pc 3.png'
import img3 from './images/image pc 2.png'



const App = () => {
  // 1- Déclarer l'état local initialisé avec le JSON
  const [produits, setProduits] = useState([
    {
      id: 2,
      title: "PC Portable Gamer",
      price: "2190 DH",
      thumbnail: img1
    },
    {
      id: 3,
      title: "PC Portable Chromebook Acer",
      price: "3640 DH",
      thumbnail: img2
    },
    {
      id: 4,
      title: "PC Portable HUAWEI",
      price: "1270 DH",
      thumbnail: img3
    }
  ]);

  return (
    <div className="pcs">
      <h1>Liste des PCs</h1>
      {/* 3- Composante affichant les produits */}
      <ListeProduits produits={produits} />
    </div>
  );
};

export default App;
