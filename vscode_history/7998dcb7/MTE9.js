import React from "react";
import Produit from "./Produit";

const ListeProduits = ({ produits }) => {
  return (
    <div className="liste-produits">
      {produits.map((p) => (
        <Produit key={p.id} produit={p} />
      ))}
    </div>
  );
};

export default ListeProduits;
