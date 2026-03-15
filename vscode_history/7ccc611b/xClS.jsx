import React from "react";

export default function ProduitList({ produits }) {
  if (produits.length === 0) {
    return <p>Aucun produit trouvé</p>;
  }
  
  return (
    <ul>
      {produits.map((pro) => (<li key={p.id}>
          {p.nom} ({p.type})
        </li>
      ))}
    </ul>
  );
}
