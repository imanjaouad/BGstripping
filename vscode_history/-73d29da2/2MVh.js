import React, { useState } from "react";
import Produit from "./components/Produit";
import ListeProduits from "./components/ListeProduits";
import {img1} from './images/image pc.jfif'
import {img2} from './images/image pc 3.jfif'
import {img3} from './images/image pc 2.jfif'



const App = () => {
  // 1- Déclarer l'état local initialisé avec le JSON
  const [produits, setProduits] = useState([
    {
      id: 2,
      title: "PC Portable Gamer",
      price: "2190 DH",
      thumbnail: "HP14424U3EA.jpg"
    },
    {
      id: 3,
      title: "PC Portable Chromebook Acer",
      price: "3640 DH",
      thumbnail: "NXATHEF002.jpg"
    },
    {
      id: 4,
      title: "PC Portable HUAWEI",
      price: "1270 DH",
      thumbnail: "HUA6901443442959.jpg"
    }
  ]);

  return (
    <div>
      <h1>Liste des PCs</h1>
      {/* 3- Composante affichant les produits */}
      <ListeProduits produits={produits} />
    </div>
  );
};

export default App;
